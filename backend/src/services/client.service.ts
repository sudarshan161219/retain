import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient.js";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { ClientStatus } from "@prisma/client";
import ExcelJS from "exceljs";
import slugify from "slugify";
import { nanoid } from "nanoid";

@injectable()
export class ClientService {
  /**
   * CREATE CLIENT (RETAINER)
   * Generates the Admin Token (Access Key) and Obscured Slug (Public Link)
   */
  async createClient(
    userId: string,
    data: { name: string; totalHours: number; refillLink?: string },
  ) {
    //  Generate public slug (e.g. "acme-corp-x9z2k")
    const baseSlug = slugify.default(data.name, { lower: true, strict: true });
    const slug = `${baseSlug}-${nanoid(5)}`;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { defaultRefillLink: true },
    });

    if (!user) {
      throw new AppError({
        message: "there is no user, please register.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "INVALID_CREDENTIALS",
        debugMessage: `no user found`,
      });
    }

    // 2. logic: Use provided link OR fall back to user default
    const finalRefillLink = data.refillLink || user.defaultRefillLink;

    const client = await prisma.client.create({
      data: {
        userId,
        name: data.name,
        slug,
        currentBalance: data.totalHours,
        refillLink: finalRefillLink,
        status: ClientStatus.ACTIVE,
      },
    });

    return client;
  }

  /**
   * GET CLIENT (ADMIN VIEW)
   * Returns EVERYTHING: Admin Token, Logs, Budget.
   * Used when visiting /manage/:adminToken
   */
  async getClientById(userId: string, clientId: string) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 100,
        },
        user: { select: { name: true, email: true, defaultRefillLink: true } },
      },
    });

    if (!client) {
      throw new AppError({
        message: "Client not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return client;
  }

  /**
   * GET CLIENT (PUBLIC VIEW)
   * Returns RESTRICTED data.
   * CRITICAL: Explicitly selects fields to hide 'adminToken'.
   */
  async getClientBySlug(slug: string) {
    const client = await prisma.client.findUnique({
      where: { slug },
      select: {
        name: true,
        slug: true,
        currentBalance: true,
        refillLink: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        logs: {
          orderBy: { date: "desc" },
          select: {
            description: true,
            hours: true,
            date: true,
            type: true,
          },
        },
      },
    });

    if (!client) {
      throw new AppError({
        message: "Retainer dashboard not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    return client;
  }

  /**
   * ADD WORK LOG
   */
  async addWorkLog(
    userId: string, // admin"
    clientId: string, // client"
    data: {
      description: string;
      hours: number;
      date: Date;
      type?: "WORK" | "REFILL";
    },
  ) {
    const { description, hours, date, type = "WORK" } = data;

    return await prisma.$transaction(async (tx) => {
      const client = await tx.client.findFirst({
        where: {
          id: clientId,
          userId: userId,
        },
      });

      if (!client) {
        throw new AppError({
          message: "Client not found or unauthorized",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (client.status !== "ACTIVE") {
        throw new AppError({
          message: `Cannot log hours. Client is ${client.status}`,
          statusCode: StatusCodes.FORBIDDEN,
        });
      }

      // 2. Create the Log
      const newLog = await tx.workLog.create({
        data: {
          clientId: client.id,
          description,
          hours, // e.g., 2.5
          date,
          type,
        },
        include: {
          client: true, // Return client info so Controller can emit to the correct 'slug' room
        },
      });

      // 3. Update the "Bank Balance"
      // If type is WORK, we subtract hours.
      // If type is REFILL, we add hours.
      const operation = type === "REFILL" ? "increment" : "decrement";

      await tx.client.update({
        where: { id: clientId },
        data: {
          currentBalance: {
            [operation]: hours,
          },
        },
      });

      return newLog;
    });
  }

  /**
   * ADD REFILL LOG
   */
  async refillClient(
    userId: string, // Authenticated User
    clientId: string, // Target Client ID
    hours: number,
    createLog: boolean = true,
  ) {
    // Use a Transaction to ensure Authorization + Update + Log happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify Ownership (Security Check)
      //  check this INSIDE the transaction to prevent race conditions
      const client = await tx.client.findFirst({
        where: {
          id: clientId,
          userId: userId,
        },
      });

      if (!client) {
        throw new AppError({
          message: "Client not found or unauthorized",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // 2. Update Balance (The "Bank Deposit")
      const updatedClient = await tx.client.update({
        where: { id: clientId },
        data: {
          currentBalance: { increment: hours }, // Atomic increment
        },
      });

      let newLog = null;

      // 3. Create Audit Log (The "Receipt")
      if (createLog) {
        newLog = await tx.workLog.create({
          data: {
            clientId: client.id,
            description: `⚡ Refill: Added ${hours} hours`,
            hours: hours,
            type: "REFILL",
            date: new Date(),
          },
        });
      }

      return { client: updatedClient, log: newLog };
    });

    return result;
  }
  /**
   * DELETE LOG
   */
  async deleteWorkLog(userId: string, logId: string) {
    return await prisma.$transaction(async (tx) => {
      //* fetching log with client details
      const log = await tx.workLog.findUnique({
        where: { id: logId },
        include: { client: true },
      });

      if (!log) {
        throw new AppError({
          message: "Log entry not found",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      //* Authorization: check does this log belongs to a client owned by user(admin)
      if (log.client.userId !== userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      //* Reversing the Balance Impact (update)
      // - If user(admin) delete "WORK" (which subtracted time),  ADD it back.
      // - If user(admin) delete "REFILL" (which added time),  SUBTRACT it.
      const isWorkLog = log.type === "WORK";
      const operation = isWorkLog ? "increment" : "decrement";

      await tx.client.update({
        where: { id: log.clientId },
        data: {
          currentBalance: {
            [operation]: log.hours,
          },
        },
      });

      //* Perform the Delete
      await tx.workLog.delete({
        where: { id: logId },
      });

      return { success: true, clientSlug: log.client.slug };
    });
  }

  /**
   * UPDATE DETAILS
   * Metadata (Profile Updates).
   */
  async updateDetails(
    userId: string,
    clientId: string,
    data: { name?: string; refillLink?: string; totalHours?: number },
  ) {
    //* Verify Ownership (Security)
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
    });

    if (!client) {
      throw new AppError({
        message: "Client not found or unauthorized",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    //* Update Details
    return await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(data.name && { name: data.name }),
        // Allow clearing the link by passing an empty string or explicitly handling undefined if needed
        ...(data.refillLink !== undefined && { refillLink: data.refillLink }),
      },
    });
  }

  /**
   * TOGGLE STATUS (Pause/Resume)
   */
  async updateStatus(userId: string, clientId: string, status: ClientStatus) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
    });

    if (!client) {
      throw new AppError({
        message: "Client not found or unauthorized",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return await prisma.client.update({
      where: { id: clientId },
      data: { status },
    });
  }

  /**
   * DELETE CLIENT
   */
  async deleteClient(userId: string, clientId: string) {
    const clientToCheck = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
      select: { id: true },
    });

    if (!clientToCheck) {
      throw new AppError({
        message: "Client not found or unauthorized",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    //* Delete and Return Data
    return await prisma.client.delete({
      where: { id: clientId },
    });
  }

  /**
   * GENERATE EXCEL REPORT
   */
  async generateExcelReport(userId: string, clientId: string) {
    //* Fetch Client and Logs with Ownership Check
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
      include: {
        logs: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!client) {
      throw new AppError({
        message: "Client not found or unauthorized",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    //* Setup Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Work History");

    //* Define Columns (Added 'Type' column for clarity)
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Type", key: "type", width: 10 },
      { header: "Description", key: "description", width: 40 },
      { header: "Impact (Hrs)", key: "hours", width: 15 },
    ];

    //* Style Header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" }, // Nice professional blue
    };
    headerRow.alignment = { horizontal: "center" };

    //* Add Data Rows
    client.logs.forEach((log) => {
      const isRefill = log.type === "REFILL";
      const hours = log.hours.toNumber();

      const row = worksheet.addRow({
        date: log.date.toISOString().split("T")[0],
        type: log.type, //* 'WORK' or 'REFILL'
        description: log.description,
        //* Visual logic: Refills are positive (+), Work is negative (-)
        hours: isRefill ? hours : -hours,
      });

      //* Conditional Formatting: Green text for Refills, Red/Black for Work
      if (isRefill) {
        row.getCell("type").font = { color: { argb: "008000" }, bold: true };
        row.getCell("hours").font = { color: { argb: "008000" }, bold: true };
      }
    });

    //* Summary Section
    worksheet.addRow({}); //* Empty row

    //* Calculate Remaining Balance (Current State)
    const currentBalance = client.currentBalance.toNumber();

    const balanceRow = worksheet.addRow({
      description: "CURRENT REMAINING BALANCE",
      hours: currentBalance,
    });

    balanceRow.font = { bold: true, size: 12 };
    balanceRow.getCell("hours").numFmt = "0.00"; //* Format as number

    //* Generate Filename
    const safeName = client.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return {
      workbook,
      fileName: `${safeName}_retainer_report.xlsx`,
    };
  }
}

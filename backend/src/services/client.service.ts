import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient.js";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { Prisma, ClientStatus } from "@prisma/client";
import type { GetClientsParams } from "../types/client.types.js";
import ExcelJS from "exceljs";
import slugify from "slugify";
import { nanoid } from "nanoid";

@injectable()
export class ClientService {
  /**
   * CREATE CLIENT (RETAINER)
   */
  async createClient(
    userId: string,
    data: {
      name: string;
      email: string;
      totalHours: number;
      hourlyRate?: number;
      currency?: string;
      refillLink?: string;
    },
  ) {
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

    const finalRefillLink = data.refillLink || user.defaultRefillLink;

    const client = await prisma.client.create({
      data: {
        userId,
        name: data.name,
        email: data.email,
        slug,
        totalHours: data.totalHours,
        hoursLogged: 0,
        hourlyRate: data.hourlyRate || 0,
        currency: data.currency || "USD",
        refillLink: finalRefillLink,
        status: ClientStatus.ACTIVE,
      },
    });

    return client;
  }

  async getClients({
    userId,
    search,
    status,
    page = 1,
    limit = 10,
  }: GetClientsParams) {
    const defaultPage = Math.max(1, page);
    const defaultLimit = Math.max(100, limit);
    const skip = (defaultPage - 1) * defaultLimit;

    const isValidStatus =
      status && Object.values(ClientStatus).includes(search as ClientStatus);

    const whereClause: Prisma.ClientWhereInput = {
      userId: userId,

      ...(search?.trim() && {
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { email: { contains: search.trim(), mode: "insensitive" } },
        ],
      }),

      ...(isValidStatus && { status: status as ClientStatus }),
    };

    const [client, total] = await prisma.$transaction([
      prisma.client.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.client.count({ where: whereClause }),
    ]);

    return {
      data: client,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
   *
   */
  async getClientBySlug(slug: string) {
    const client = await prisma.client.findUnique({
      where: { slug },
      select: {
        name: true,
        slug: true,
        currentBalance: true,
        totalHours: true,
        hourlyRate: true,
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
    userId: string,
    clientId: string,
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
          hoursLogged: {
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
    userId: string,
    clientId: string,
    hours: number,
    newRate?: number,
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

      const updateData: any = {
        currentBalance: { increment: hours },
        totalHours: { increment: hours },
      };

      if (newRate !== undefined && client.hourlyRate.toNumber() !== newRate) {
        updateData.hourlyRate = newRate;
      }

      // 2. Update Balance (The "Bank Deposit")
      const updatedClient = await tx.client.update({
        where: { id: clientId },
        data: updateData,
      });

      let newLog = null;

      let description = `⚡ Refill: Added ${hours} hours`;
      const currentRate = client.hourlyRate.toNumber();

      if (newRate && newRate !== currentRate) {
        description += ` (Rate updated to $${newRate}/hr)`;
      }

      // 3. Create Audit Log (The "Receipt")
      if (createLog) {
        newLog = await tx.workLog.create({
          data: {
            clientId: client.id,
            description: description,
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
          hoursLogged: {
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
    data: {
      name?: string;
      email?: string;
      totalHours?: number;
      rate?: number;
      currency?: string;
      refillLink?: string | null;
    },
  ) {
    try {
      return await prisma.client.update({
        where: {
          id: clientId,
          userId: userId,
        },

        data: {
          name: data.name,
          email: data.email,
          totalHours: data.totalHours,
          hourlyRate: data.rate,
          currency: data.currency,
          refillLink: data.refillLink,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new AppError({
          message: "Client not found or unauthorized",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }
      throw error;
    }
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
    const totalHours = client.totalHours.toNumber();
    const loggedHours = client.hoursLogged.toNumber();

    const currentBalance = totalHours - loggedHours;

    const balanceRow = worksheet.addRow({
      description: "CURRENT REMAINING BALANCE",
      hours: currentBalance,
    });

    balanceRow.font = { bold: true, size: 12 };
    balanceRow.getCell("hours").numFmt = "0.00";

    //* Generate Filename
    const safeName = client.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return {
      workbook,
      fileName: `${safeName}_retainer_report.xlsx`,
    };
  }
}

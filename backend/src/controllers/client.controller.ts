import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types.js";
import { ClientService } from "../services/client.service.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { getIO } from "../socket/index.js";
import { ClientStatus } from "@prisma/client";

@injectable()
export class ClientController {
  constructor(
    @inject(TYPES.ClientService)
    private clientService: ClientService,
  ) {}

  /**
   * Helper: handles socket emission without crashing the request
   */
  private emitUpdate(slug: string | undefined, type: string, payload: any) {
    if (!slug) return;
    try {
      const io = getIO();
      io.to(slug).emit("retainer-update", { type, data: payload });
    } catch (err) {
      console.error(`⚠️ Socket emit failed for ${slug}:`, err);
    }
  }

  /**
   * CREATE RETAINER
   * POST /api/clients
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;

      const { name, totalHours, refillLink, hourlyRate, currency } = req.body;

      if (!name || typeof name !== "string") {
        throw new AppError({
          message: "Client name is required",
          statusCode: 400,
        });
      }

      if (
        totalHours === undefined ||
        totalHours === null ||
        isNaN(Number(totalHours))
      ) {
        throw new AppError({
          message: "Total hours (Initial Balance) is required",
          statusCode: 400,
        });
      }

      const client = await this.clientService.createClient(userId, {
        name,
        totalHours: Number(totalHours),
        hourlyRate,
        currency,
        refillLink,
      });

      res.status(StatusCodes.CREATED).json({
        message: "Client created successfully",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET ONE CLIENT (Admin View)
   * GET /api/clients/:id
   */
  async getClientDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });

      const userId = req.user.id;
      const { id: clientId } = req.params;

      const client = await this.clientService.getClientById(userId, clientId);

      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUBLIC DASHBOARD (Client View)
   * GET /api/public/:slug
   * No Auth required
   */
  async getPublicOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      if (!slug) {
        throw new AppError({ message: "Slug is required", statusCode: 400 });
      }

      const publicView = await this.clientService.getClientBySlug(slug);

      return res.status(StatusCodes.OK).json({
        role: "CLIENT",
        data: publicView,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ADD WORK LOG
   * POST /api/clients/:id/logs
   */
  async addLog(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;

      const { id: clientId } = req.params;

      const { description, hours, date } = req.body;

      if (!description || !hours) {
        throw new AppError({
          message: "Description and Hours are required",
          statusCode: 400,
        });
      }

      const newLog = await this.clientService.addWorkLog(userId, clientId, {
        description,
        hours: Number(hours),
        date: date ? new Date(date) : new Date(),
        type: "WORK",
      });

      this.emitUpdate(newLog.client?.slug, "ADD_LOG", newLog);

      return res.status(StatusCodes.CREATED).json({
        message: "Log added",
        data: newLog,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * REFILL BALANCE
   * POST /api/clients/:id/refill
   */
  async addRefillLog(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { id: clientId } = req.params;

      const { hours, createLog } = req.body;

      if (!hours || isNaN(Number(hours))) {
        throw new AppError({
          message: "Valid hours amount is required",
          statusCode: 400,
        });
      }

      const { client, log } = await this.clientService.refillClient(
        userId,
        clientId,
        Number(hours),
        createLog,
      );

      this.emitUpdate(client.slug, "REFILL", {
        currentBalance: client.currentBalance,
        log: log,
      });

      return res.status(StatusCodes.OK).json({
        message: "Balance refilled successfully",
        data: {
          currentBalance: client.currentBalance,
          log,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE LOG
   * DELETE /api/logs/:logId
   * (Service finds the client via the Log ID, so no clientId param needed)
   */
  async deleteLog(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { logId } = req.params;

      const result = await this.clientService.deleteWorkLog(userId, logId);

      this.emitUpdate(result.clientSlug, "DELETE_LOG", logId);

      return res.status(StatusCodes.OK).json({ message: "Log deleted" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE DETAILS (Settings)
   * PATCH /api/clients/:id
   */
  async updateDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { id: clientId } = req.params;

      const { name, refillLink } = req.body;

      const client = await this.clientService.updateDetails(userId, clientId, {
        name,
        refillLink,
      });

      this.emitUpdate(client.slug, "DETAILS_UPDATE", client);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE STATUS
   * PATCH /api/clients/:id/status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { id: clientId } = req.params;
      const { status } = req.body;

      if (!Object.values(ClientStatus).includes(status)) {
        throw new AppError({ message: "Invalid status", statusCode: 400 });
      }

      const updatedClient = await this.clientService.updateStatus(
        userId,
        clientId,
        status,
      );

      this.emitUpdate(updatedClient.slug, "STATUS_UPDATE", { status });

      res.status(200).json({ data: updatedClient });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE CLIENT
   * DELETE /api/clients/:id
   */
  async deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { id: clientId } = req.params;

      const deletedClient = await this.clientService.deleteClient(
        userId,
        clientId,
      );

      this.emitUpdate(deletedClient.slug, "PROJECT_DELETED", deletedClient);

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * EXPORT EXCEL
   * GET /api/clients/:id/export
   */
  async exportClientLogs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new AppError({ message: "Unauthorized", statusCode: 401 });
      const userId = req.user.id;
      const { id: clientId } = req.params;

      const { workbook, fileName } =
        await this.clientService.generateExcelReport(userId, clientId);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: "Could not generate report" });
    }
  }
}

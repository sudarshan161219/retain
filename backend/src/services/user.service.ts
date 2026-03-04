import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient.js";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { DateFormat } from "@prisma/client";

export interface UpdatePreferenceDTO {
  dateFormat?: DateFormat;
  timezone?: string;
}

export interface UpdateWorkspaceDTO {
  businessName?: string;
  logoUrl?: string;
  taxId?: string;
  defaultHourlyRate?: number;
  defaultCurrency?: string;
  defaultRefillLink?: string;
}

@injectable()
export class UserService {
  async getByUserId(userId: string) {
    try {
      return await prisma.preference.findUnique({
        where: { userId },
      });
    } catch (error) {
      throw new AppError({
        message: "Failed to fetch preferences.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PREFERENCE_FETCH_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async updateWorkspace(userId: string, data: UpdateWorkspaceDTO) {
    try {
      const workspace = await prisma.workspace.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data,
        },
      });

      return workspace;
    } catch (error) {
      throw new AppError({
        message: "Failed to update workspace settings.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "WORKSPACE_UPDATE_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async updatePreference(userId: string, data: UpdatePreferenceDTO) {
    try {
      const preference = await prisma.preference.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data,
        },
      });

      return preference;
    } catch (error) {
      throw new AppError({
        message: "Failed to update preference settings.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PREFERENCE_UPDATE_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }
}

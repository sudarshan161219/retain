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
  async getSettingsByUserId(userId: string) {
    try {
      const userSettings = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          provider: true,
          // Pull in the 1:1 relationships
          workspace: true,
          preference: true,
        },
      });

      if (!userSettings) {
        throw new AppError({
          message: "User not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "USER_NOT_FOUND",
        });
      }

      return userSettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: "Failed to fetch user settings.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "USER_SETTINGS_FETCH_FAILED",
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

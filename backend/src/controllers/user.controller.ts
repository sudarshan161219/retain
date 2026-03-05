import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { TYPES } from "../types/types.js";
import { AppError } from "../errors/AppError.js";

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  /**
   * GET /api/settings
   * Fetches the user, workspace, and preferences in one go.
   */
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "Unauthorized access.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED",
        });
      }

      const settings = await this.userService.getSettingsByUserId(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT/PATCH /api/settings/workspace
   * Updates or creates the workspace details for the user.
   */
  async updateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "Unauthorized access.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED",
        });
      }

      // In a production app, you'd validate req.body with Zod/Joi here first
      const updatedWorkspace = await this.userService.updateWorkspace(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Workspace updated successfully.",
        data: updatedWorkspace,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT/PATCH /api/settings/preference
   * Updates or creates the preference settings for the user.
   */
  async updatePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "Unauthorized access.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED",
        });
      }

      const updatedPreference = await this.userService.updatePreference(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Preferences updated successfully.",
        data: updatedPreference,
      });
    } catch (error) {
      next(error);
    }
  }
}

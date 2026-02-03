import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/AppError.js";
import type { JwtUserPayload } from "../../types/auth.types.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(
        new AppError({
          message: "Not logged in",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "AUTH_TOKEN_MISSING",
        }),
      );
    }

    try {
      // 2. Verify Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as JwtUserPayload;

      // 3. Attach User
      // Note: If you set up types/express.d.ts correctly, you don't need 'as AuthRequest'
      req.user = decoded;

      next();
    } catch (error: any) {
      // 4. Handle Specific JWT Errors
      if (error.name === "TokenExpiredError") {
        return next(
          new AppError({
            message: "Session expired. Please log in again.",
            statusCode: StatusCodes.UNAUTHORIZED,
            code: "AUTH_TOKEN_EXPIRED",
          }),
        );
      }

      return next(
        new AppError({
          message: "Invalid session.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "AUTH_TOKEN_INVALID",
        }),
      );
    }
  },
);

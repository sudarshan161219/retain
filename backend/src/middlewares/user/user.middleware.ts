import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { AppError } from "../../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // .parse() strips out any random extra fields the user sends
      // that aren't defined in the Zod schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable string: "logoUrl: Must be a valid URL"
        const errorMessages = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        next(
          new AppError({
            message: "Invalid request data",
            statusCode: StatusCodes.BAD_REQUEST,
            code: "VALIDATION_ERROR",
            debugMessage: errorMessages,
          }),
        );
      } else {
        next(error);
      }
    }
  };
};

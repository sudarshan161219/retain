import type { AuthRequest } from "../types/express/index.js";
import type { Request, Response, NextFunction } from "express";

const wrapWithAuthRequest =
  (
    handler: (
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ) => Promise<void>,
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req as AuthRequest, res, next);

export { wrapWithAuthRequest };

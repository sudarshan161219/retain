import { JwtUserPayload } from "../auth.types";
import { User as PrismaUser } from "@prisma/client";

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
    interface User extends PrismaUser {}
  }
}

export interface AuthRequest extends Request {
  user: JwtUserPayload;
}

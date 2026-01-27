import type { Request } from "express";
import type { ParsedQs } from "qs";

export interface IRegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface JwtUserPayload {
  id: string;
  email: string;
  role?: string;
  jti: string;
  exp?: number;
  iat?: number;
}

export interface jwtToken {
  token?: string;
}

// Corrected AuthRequest type
export interface AuthRequest<
  Params = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: JwtUserPayload;
}

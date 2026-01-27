import type { RequestHandler, Request, Response, NextFunction } from "express";

type AsyncMiddleware<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler = <Req extends Request = Request>(
  fn: AsyncMiddleware<Req>,
): RequestHandler => {
  return (req, res, next) => {
    fn(req as Req, res, next).catch(next);
  };
};

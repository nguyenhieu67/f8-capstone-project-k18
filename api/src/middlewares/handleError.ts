import { NextFunction, Request, Response } from "express";

import { constants } from "@/config";

function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const status = err.status || err.statusCode || constants.httpCodes.internalServerError;
  const message = err.message || "Internal Server Error";

  return res.error(message, status);
}

export default handleError;

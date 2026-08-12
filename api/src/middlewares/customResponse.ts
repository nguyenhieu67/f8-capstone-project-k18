import constants from "@/config/constants";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      success: (data: any, status?: number) => Response;
      error: (error: any, status?: number) => Response;
    }
  }
}

function customResponse(req: Request, res: Response, next: NextFunction) {
  res.success = (data: any, status = constants.httpCodes.ok) => {
    return res.status(status).json({ data });
  };

  res.error = (
    error: any,
    status = constants.httpCodes.internalServerError,
  ) => {
    return res.status(status).json({ error });
  };

  next();
}

export default customResponse;

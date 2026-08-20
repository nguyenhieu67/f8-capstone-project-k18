import { Request, Response, NextFunction } from "express";

import { constants } from "@/config";

declare global {
  namespace Express {
    interface Request {
      auth: any;
    }
    interface Response {
      success: (data: any, status?: number) => Response;
      error: (error: any, status?: number) => Response;
      notFount: () => void;
      unauthorized: () => void;
    }
  }
}

function customResponse(req: Request, res: Response, next: NextFunction) {
  res.success = (data: any, status = constants.httpCodes.ok) => {
    return res.status(status).json({ data });
  };

  // Error
  res.error = (error: any, status = constants.httpCodes.internalServerError) => {
    return res.status(status).json({ error });
  };

  // Not Found
  res.notFount = () => {
    res.error("Resource not found.", constants.httpCodes.notFound);
  };

  // Unauthorized
  res.unauthorized = () => {
    res.error("Unauthorized.", constants.httpCodes.unauthorized);
  };

  next();
}

export default customResponse;

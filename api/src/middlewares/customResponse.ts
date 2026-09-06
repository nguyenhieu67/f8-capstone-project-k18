import { Request, Response, NextFunction } from "express";

import { constants } from "@/config";
import { ErrorCode } from "@/utils/AppError";

declare global {
  namespace Express {
    interface Request {
      auth: any;
    }
    interface Response {
      success: (data: any, status?: number) => Response;
      error: (message: string, status?: number, code?: ErrorCode, details?: unknown) => Response;
      notFound: () => Response;
      unauthorized: (message?: string, code?: ErrorCode) => Response;
    }
  }
}

function customResponse(req: Request, res: Response, next: NextFunction) {
  res.success = (data: any, status = constants.httpCodes.ok) => {
    return res.status(status).json({ data });
  };

  // Error - message luôn là string thân thiện với người dùng; code là mã máy đọc để FE rẽ nhánh xử lý
  res.error = (
    message: string,
    status = constants.httpCodes.internalServerError,
    code: ErrorCode = "INTERNAL_ERROR",
    details?: unknown,
  ) => {
    return res.status(status).json({ error: message, code, ...(details !== undefined ? { details } : {}) });
  };

  // Not Found
  res.notFound = () => {
    return res.error("Không tìm thấy dữ liệu.", constants.httpCodes.notFound, "NOT_FOUND");
  };

  // Unauthorized
  res.unauthorized = (message = "Vui lòng đăng nhập để tiếp tục.", code: ErrorCode = "UNAUTHORIZED") => {
    return res.error(message, constants.httpCodes.unauthorized, code);
  };

  next();
}

export default customResponse;

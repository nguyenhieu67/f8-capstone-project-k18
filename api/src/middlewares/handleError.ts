import { NextFunction, Request, Response } from "express";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

import { env } from "@/config";
import AppError, { ErrorCode } from "@/utils/AppError";

// Postgres error codes
const PG_ERROR_STATUS: Record<string, { status: number; code: ErrorCode; message: string }> = {
  "23505": { status: 409, code: "CONFLICT", message: "Dữ liệu đã tồn tại, vui lòng kiểm tra lại." },
  "23503": {
    status: 400,
    code: "BAD_REQUEST",
    message: "Dữ liệu tham chiếu không hợp lệ hoặc đang được sử dụng ở nơi khác.",
  },
  "23502": { status: 400, code: "BAD_REQUEST", message: "Thiếu trường dữ liệu bắt buộc." },
  "23514": { status: 400, code: "BAD_REQUEST", message: "Dữ liệu không thỏa điều kiện hợp lệ." },
  "22P02": { status: 400, code: "BAD_REQUEST", message: "Định dạng dữ liệu không hợp lệ." },
};

function toAppError(err: any): AppError {
  if (err instanceof AppError) return err;

  // TypeORM: không tìm thấy bản ghi (findOneOrFail, findByOrFail, ...)
  if (err instanceof EntityNotFoundError) {
    return AppError.notFound("Không tìm thấy dữ liệu.");
  }

  // TypeORM: lỗi từ chính Postgres (trùng khóa, vi phạm FK, thiếu NOT NULL, ...)
  if (err instanceof QueryFailedError) {
    const pgCode = (err as any).code as string | undefined;
    const known = pgCode ? PG_ERROR_STATUS[pgCode] : undefined;
    if (known) return new AppError(known.message, known.status, known.code);
    return AppError.badRequest("Không thể xử lý dữ liệu, vui lòng kiểm tra lại thông tin đã nhập.");
  }

  // JWT
  if (err.name === "TokenExpiredError") {
    return new AppError("Phiên đăng nhập đã hết hạn.", 401, "TOKEN_EXPIRED");
  }
  if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
    return new AppError("Token không hợp lệ.", 401, "INVALID_TOKEN");
  }

  // Body JSON gửi lên bị sai định dạng (express.json())
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return AppError.badRequest("Dữ liệu gửi lên không đúng định dạng JSON.");
  }

  // class-validator lọt qua (phòng hờ, ValidationPipe thường đã bắt trước)
  if (Array.isArray(err) && err.length > 0 && err[0]?.constraints) {
    const messages = err.map((e: any) => Object.values(e.constraints ?? {})).flat();
    return AppError.validation(messages.join(", "), messages);
  }

  // Không xác định được -> 500, không lộ message/stack nội bộ ra ngoài production
  const message =
    env.NODE_ENV === "development" ? err.message || "Internal Server Error" : "Đã xảy ra lỗi, vui lòng thử lại sau.";
  return AppError.internal(message);
}

function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  const appError = toAppError(err);

  if (appError.status >= 500) {
    console.error(err);
  }

  return res.error(appError.message, appError.status, appError.code, appError.details);
}

export default handleError;

import { constants } from "@/config";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "GONE"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR";

class AppError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(message: string, status: number = 500, code: ErrorCode = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;

    // Giữ đúng stack trace (bỏ qua constructor này trong stack)
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, constants.httpCodes.badRequest, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Vui lòng đăng nhập để tiếp tục") {
    return new AppError(message, constants.httpCodes.unauthorized, "UNAUTHORIZED");
  }

  static forbidden(message = "Bạn không có quyền thực hiện thao tác này") {
    return new AppError(message, constants.httpCodes.forbidden, "FORBIDDEN");
  }

  static notFound(message = "Không tìm thấy dữ liệu") {
    return new AppError(message, constants.httpCodes.notFound, "NOT_FOUND");
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(message, constants.httpCodes.conffict, "CONFLICT", details);
  }

  static gone(message: string) {
    return new AppError(message, constants.httpCodes.gone, "GONE");
  }

  static validation(message: string, details?: unknown) {
    return new AppError(message, constants.httpCodes.unprocessableContent, "VALIDATION_ERROR", details);
  }

  static internal(message = "Đã xảy ra lỗi, vui lòng thử lại sau") {
    return new AppError(message, constants.httpCodes.internalServerError, "INTERNAL_ERROR");
  }
}

export default AppError;

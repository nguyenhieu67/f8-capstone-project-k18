import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

import { constants } from "@/config";

type FieldError = {
  field: string;
  messages: string[];
};

async function valid<T>(dtoClass: new () => T, body: any) {
  const dto = plainToInstance(dtoClass, body);

  // @ts-ignore
  return await validate(dto);
}

function toFieldErrors(errors: ValidationError[]): FieldError[] {
  return errors.map((e) => ({
    field: e.property,
    messages: e.constraints ? Object.values(e.constraints) : [],
  }));
}

export function ValidationPipe<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let allErrors: ValidationError[] = [];

    const body: any = req.body;
    if (Array.isArray(body)) {
      for (const item of body) {
        const errors = await valid(dtoClass, item);
        if (errors.length > 0) {
          allErrors.push(...errors);
        }
      }
    } else {
      const errors = await valid(dtoClass, body);
      if (errors.length > 0) {
        allErrors.push(...errors);
      }
    }

    if (allErrors.length > 0) {
      const fieldErrors = toFieldErrors(allErrors);
      const message = fieldErrors
        .map((f) => f.messages.join(", "))
        .filter(Boolean)
        .join(", ");

      return res.error(
        message || "Dữ liệu gửi lên không hợp lệ.",
        constants.httpCodes.unprocessableContent,
        "VALIDATION_ERROR",
        fieldErrors,
      );
    }

    next();
  };
}

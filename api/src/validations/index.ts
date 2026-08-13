import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import constants from "@/config/constants";

async function valid<T>(dtoClass: new () => T, body: any) {
  const dto = plainToInstance(dtoClass, body);

  // @ts-ignore
  return await validate(dto);
}

export function ValidationPipe<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let allEroors: ValidationError[] = [];

    const body: any = req.body;
    if (Array.isArray(body)) {
      for (const item of body) {
        const errors = await valid(dtoClass, item);
        if (errors.length > 0) {
          allEroors.push(...errors);
        }
      }
    } else {
      const errors = await valid(dtoClass, body);
      if (errors.length > 0) {
        allEroors.push(...errors);
      }
    }

    if (allEroors.length > 0) {
      const msges = allEroors
        .map((e) => (e.constraints ? Object.values(e.constraints) : []))
        .flat();

      return res.status(constants.httpCodes.unprocessableContent).json({
        statusCode: constants.httpCodes.unprocessableContent,
        message: msges.join(", "),
        error: "Unprocessable Entity",
      });
    }

    next();
  };
}

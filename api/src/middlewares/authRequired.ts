import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config";
import { AppError } from "@/utils";
import userService from "@/modules/users/UserService";

async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw AppError.unauthorized("Bạn chưa đăng nhập.");
    }

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(accessToken, env.AUTH_JWT_SECRET as string) as jwt.JwtPayload;
    } catch (jwtError: any) {
      throw jwtError;
    }

    const userId = payload.sub;
    const user = await userService.getById(Number(userId));

    if (!user) {
      throw AppError.unauthorized("Tài khoản không tồn tại.");
    }

    req.auth = { user };

    next();
  } catch (error) {
    next(error);
  }
}

export default authRequired;

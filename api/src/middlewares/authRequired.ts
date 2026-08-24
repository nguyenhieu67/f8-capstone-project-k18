import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config";
import userService from "@/modules/users/UserService";

async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.unauthorized();
    }

    const payload = jwt.verify(accessToken, env.AUTH_JWT_SECRET as string) as jwt.JwtPayload;

    const userId = payload.sub;
    const user = await userService.getById(Number(userId));

    if (!user) return res.unauthorized();

    req.auth = {
      user,
    };

    next();
  } catch (error) {
    return res.unauthorized();
  }
}

export default authRequired;

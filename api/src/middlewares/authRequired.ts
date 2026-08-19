import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config";
import { userService } from "@/services";

async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers?.authorization?.replace("Bearer", "")?.trim();
    if (!accessToken) {
      return res.unauthorized();
    }

    const payload = jwt.verify(accessToken, env.AUTH_JWT_SECRET as string) as jwt.JwtPayload;

    if (payload.exp! < Date.now() / 1000) {
      return res.unauthorized();
    }

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

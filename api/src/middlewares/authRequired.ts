import env from "@/config/environment";
import { userService } from "@/services";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

async function authRequired(req: Request, res: Response, next: NextFunction) {
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
}

export default authRequired;

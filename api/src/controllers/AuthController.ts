import { Request, Response } from "express";

import { authService } from "@/services";
import { BaseController } from "./BaseController";
import { env } from "@/config";

class AuthController extends BaseController {
  private setAuthCookies = (res: Response, accessToken: string, accessTokenTtl: number, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: accessTokenTtl * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: env.AUTH_REFRESHTOKEN_TTL * 24 * 60 * 60 * 1000,
    });
  };

  register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role, phone, avatarUrl, lastLoginAt } = req.body;
    const userAgent = req.headers["user-agent"];
    const user = await authService.register({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      avatarUrl,
      lastLoginAt,
    });
    const { accessToken, accessTokenTtl, refreshToken } = await authService.generateUserTokens(user, userAgent);

    this.setAuthCookies(res, accessToken, accessTokenTtl, refreshToken);
    return res.success({ id: user?.id, email }, 201);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userAgent = req.headers["user-agent"];
    const [error, tokens] = await authService.login({ email, password, userAgent });
    if (error || !tokens) return res.unauthorized();

    this.setAuthCookies(res, tokens.accessToken, tokens.accessTokenTtl, tokens.refreshToken);
    return res.success({}, 201);
  };

  refreshToken = async (req: Request, res: Response) => {
    const userAgent = req.headers["user-agent"];
    const token = req.cookies?.refreshToken;
    if (!token) return res.unauthorized();

    const [error, tokens] = await authService.handleRefreshToken(token, userAgent);
    if (error || !tokens) return res.unauthorized();

    this.setAuthCookies(res, tokens.accessToken, tokens.accessTokenTtl, tokens.refreshToken);
    return res.success({});
  };

  getCurrentUser = async (req: Request, res: Response) => {
    const user = req.auth.user;
    const showUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.success(showUser);
  };

  forgotPassword = async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    return res.success({ message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi." });
  };

  resetPassword = async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    return res.success({ message: "Đặt lại mật khẩu thành công." });
  };
}

export default new AuthController(authService);

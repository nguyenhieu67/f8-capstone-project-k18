import { Request, Response } from "express";

import authService from "./services/AuthService";
import { BaseController } from "@/common";
import { constants, env } from "@/config";
import { AppError } from "@/utils";
import { toUserMeDto } from "../users/UserDto";

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
    const { email, password, firstName, lastName, role, phone, langCode, avatarUrl } = req.body;
    const userAgent = req.headers["user-agent"];
    const user = await authService.register({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      langCode,
      avatarUrl,
    });
    const { accessToken, accessTokenTtl, refreshToken } = await authService.generateUserTokens(user, userAgent);

    this.setAuthCookies(res, accessToken, accessTokenTtl, refreshToken);
    return res.success({ id: user?.id, email }, 201);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userAgent = req.headers["user-agent"];
    const [error, tokens] = await authService.login({ email, password, userAgent });

    if (error)
      return res.error(
        new AppError("Sai email hoặc mật khẩu", constants.httpCodes.badRequest),
        constants.httpCodes.badRequest,
      );
    if (!tokens) return res.unauthorized();

    this.setAuthCookies(res, tokens.accessToken, tokens.accessTokenTtl, tokens.refreshToken);
    return res.success({}, 201);
  };

  logout = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    if (token) {
      await authService.revokeRefreshToken(token);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.success({});
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
    res.success(toUserMeDto(req.auth.user));
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

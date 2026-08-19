import { Request, Response } from "express";
import { authService } from "@/services";
import { BaseController } from "./BaseController";

class AuthController extends BaseController {
  register = async (req: Request, res: Response) => {
    const { email, password, first_name, last_name } = req.body;
    const userAgent = req.headers["user-agent"];
    const user = await authService.register({
      email,
      password,
      first_name,
      last_name,
    });
    const userTokens = await authService.generateUserTokens(user, userAgent);
    return res.success(userTokens, 201);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userAgent = req.headers["user-agent"];
    const result = await authService.login({
      email,
      password,
      userAgent: userAgent,
    });
    if (!result || result[0]) return res.unauthorized();
    return res.success(result[1], 201);
  };

  refreshToken = async (req: Request, res: Response) => {
    const userAgent = req.headers["user-agent"];
    const [error, data] = await authService.handleRefreshToken(req.body.refreshToken, userAgent);

    if (error) return res.unauthorized();
    res.success(data);
  };

  getCurrentUser = async (req: Request, res: Response) => {
    res.success(req.auth.user);
  };
}

export default new AuthController(authService);

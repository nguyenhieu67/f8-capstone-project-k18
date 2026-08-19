import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { constants, env } from "@/config";
import { UserEntity } from "@/entities";
import { AppError, randomString } from "@/utils";
import { BaseService } from "./BaseService";
import refreshTokenService from "./RefreshTokenService";
import UserService from "./UserService";

interface RegisterI {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface LoginI {
  email: string;
  password: string;
  userAgent?: string;
}

class AuthService extends BaseService {
  async register(data: RegisterI) {
    const existing = await this.findOneBy({ email: data.email });
    if (existing) {
      throw new AppError("Email đã được sử dụng", constants.httpCodes.conffict);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.create({
      ...data,
      password: hash,
    });

    return user;
  }

  async login(data: LoginI) {
    const user = await this.findOneBy({ email: data.email });
    if (!user) return [true, null];

    const isValid = await bcrypt.compare(data.password, (user as UserEntity).password);
    if (isValid) {
      const userTokens = await this.generateUserTokens(user, data.userAgent);
      return [null, userTokens];
    }
  }

  generateAccessToken(user: any) {
    const expiresAt = Math.floor(Date.now() / 1000 + env.AUTH_ACCESS_TOKEN_TTL);
    const accessToken = jwt.sign({ sub: user.id, exp: expiresAt }, env.AUTH_JWT_SECRET as string);
    return accessToken;
  }

  async generateRefreshToken(user: any, userAgent?: string) {
    const token = randomString(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.AUTH_REFRESHTOKEN_TTL);

    await refreshTokenService.create({
      user_id: Number(user.id),
      token,
      expires_at: expiresAt,
      user_agent: userAgent,
    });

    return token;
  }

  async handleRefreshToken(token: string, userAgent?: string) {
    const refreshToken = await refreshTokenService.findValidToken(token);
    if (!refreshToken) return [true, null];

    const user = { id: refreshToken?.user_id };
    const userTokens = await this.generateUserTokens(user, userAgent);
    await refreshTokenService.revoke(refreshToken.id);

    return [null, userTokens];
  }

  async getUserById(id: number) {
    const user = await UserService.getById(id);
    return user;
  }

  async generateUserTokens(user: any, userAgent?: string) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, userAgent);

    return {
      accessToken,
      accessTokenTtl: env.AUTH_ACCESS_TOKEN_TTL,
      refreshToken,
    };
  }
}

export default new AuthService(UserEntity);

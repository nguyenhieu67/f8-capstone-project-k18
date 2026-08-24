import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { constants, env } from "@/config";
import { AppError, randomString, sendEmail } from "@/utils";
import { UserEntity, UserLangCode, UserRole } from "@/modules/users/UserEntity";
import { BaseService } from "@/common";
import refreshTokenService from "./RefreshTokenService";
import userService from "@/modules/users/UserService";
import passwordResetService from "./PasswordResetService";

interface RegisterI {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  langCode?: UserLangCode;
  avatarUrl?: string;
}

interface LoginI {
  email: string;
  password: string;
  userAgent?: string;
}

type UserTokens = {
  accessToken: string;
  accessTokenTtl: number;
  refreshToken: string;
};

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

  async login(data: LoginI): Promise<[AppError | null, UserTokens | null]> {
    const user = await this.findOneBy({ email: data.email }, ["password"]);
    if (!user) return [new AppError("Sai email hoặc mật khẩu", constants.httpCodes.unauthorized), null];

    console.log(data.password);

    const isValid = await bcrypt.compare(data.password, (user as UserEntity).password);
    if (!isValid) return [new AppError("Sai email hoặc mật khẩu", constants.httpCodes.badRequest), null];

    await this.updateById(user.id, { lastLoginAt: new Date() });
    const userTokens = await this.generateUserTokens(user, data.userAgent);
    return [null, userTokens];
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
      userId: Number(user.id),
      token,
      expiresAt,
      userAgent,
    });

    return token;
  }

  async handleRefreshToken(token: string, userAgent?: string): Promise<[AppError | null, UserTokens | null]> {
    const refreshToken = await refreshTokenService.findValidToken(token);
    if (!refreshToken) {
      return [new AppError("Refresh token không hợp lệ", constants.httpCodes.unauthorized), null];
    }

    const user = { id: refreshToken.userId };
    const userTokens = await this.generateUserTokens(user, userAgent);
    await refreshTokenService.revoke(refreshToken.id);

    return [null, userTokens];
  }

  async revokeRefreshToken(token: string) {
    const refreshToken = await refreshTokenService.findValidToken(token);
    if (refreshToken) {
      await refreshTokenService.revoke(refreshToken.id);
    }
    return [null, null];
  }

  async getUserById(id: number) {
    const user = await userService.getById(id);
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

  async forgotPassword(email: string) {
    const user = await this.findOneBy({ email });

    if (!user) return;

    await passwordResetService.invalidateOldTokens((user as UserEntity).id);

    const token = randomString(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15m

    await passwordResetService.create({
      userId: (user as UserEntity).id,
      token,
      expiresAt,
    });

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Đặt lại mật khẩu - EduCRM",
      `<p>Nhấn vào link sau để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
     <a href="${resetLink}">${resetLink}</a>`,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await passwordResetService.findValidToken(token);
    if (!resetRecord) {
      throw new AppError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", constants.httpCodes.badRequest);
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await userService.updateById(resetRecord.userId, { password: hash });
    await passwordResetService.markUsed(resetRecord.id);
  }
}

export default new AuthService(UserEntity);

import { AppDataSource } from "@/config";
import { PasswordResetEntity } from "@/entities";
import { BaseService } from "./BaseService";

class PasswordResetService extends BaseService {
  async findValidToken(token: string) {
    return AppDataSource.getRepository(PasswordResetEntity)
      .createQueryBuilder("password_reset")
      .where("password_reset.token = :token", { token })
      .andWhere("password_reset.used_at IS NULL")
      .andWhere("password_reset.expires_at > :now", { now: new Date() })
      .getOne();
  }

  async markUsed(id: number) {
    return AppDataSource.getRepository(PasswordResetEntity)
      .createQueryBuilder("password_reset")
      .update({ usedAt: new Date() })
      .where("id = :id", { id })
      .execute();
  }

  async invalidateOldTokens(userId: number) {
    return AppDataSource.getRepository(PasswordResetEntity)
      .createQueryBuilder("password_reset")
      .update({ usedAt: new Date() })
      .where("user_id = :userId", { userId })
      .andWhere("used_at IS NULL")
      .execute();
  }
}

export default new PasswordResetService(PasswordResetEntity, false);

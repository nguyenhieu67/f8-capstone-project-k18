import { AppDataSource } from "@/config/database";
import { BaseService } from "./BaseService";
import { RefreshTokenEntity } from "@/entities";

class RefreshTokenService extends BaseService {
  async findValidToken(token: string) {
    return AppDataSource.getRepository(RefreshTokenEntity)
      .createQueryBuilder("refresh_token")
      .where("refresh_token.token = :token", { token })
      .andWhere("refresh_token.revoked_at IS NULL")
      .andWhere("refresh_token.expires_at > :now", { now: new Date() })
      .getOne();
  }

  async revoke(id: number) {
    return AppDataSource.getRepository(RefreshTokenEntity)
      .createQueryBuilder("refresh_token")
      .update({ revoked_at: new Date() })
      .where("id = :id", { id })
      .execute();
  }
}

export default new RefreshTokenService(RefreshTokenEntity, false);

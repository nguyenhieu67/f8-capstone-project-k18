import { AppDataSource } from "@/config";
import { RefreshTokenEntity } from "@/entities";
import { BaseService } from "./BaseService";

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
    return AppDataSource.getRepository(RefreshTokenEntity).createQueryBuilder("refresh_token").update({ revokedAt: new Date() }).where("id = :id", { id }).execute();
  }
}

export default new RefreshTokenService(RefreshTokenEntity, false);

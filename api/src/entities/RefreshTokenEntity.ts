import { Entity, Column } from "typeorm";
import { SimpleEntity } from "./SimpleEntity";

@Entity("refresh_token")
export class RefreshTokenEntity extends SimpleEntity {
  @Column({ type: "bigint" })
  user_id!: number;

  @Column({ type: "text" })
  token!: string;

  @Column({ type: "timestamptz" })
  expires_at!: Date;

  @Column({ type: "timestamptz" })
  revoked_at?: Date;

  @Column({ type: "text" })
  user_agent?: string;

  @Column({ type: "text" })
  ip_address?: string;
}

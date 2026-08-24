import { Entity, Column } from "typeorm";

import { SimpleEntity } from "@/common";

@Entity("refresh_token")
export class RefreshTokenEntity extends SimpleEntity {
  @Column({ type: "bigint" })
  userId!: number;

  @Column({ type: "text" })
  token!: string;

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @Column({ type: "timestamptz" })
  revokedAt?: Date;

  @Column({ type: "text" })
  userAgent?: string;

  @Column({ type: "text" })
  ipAddress?: string;
}

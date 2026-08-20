import { Entity, Column } from "typeorm";
import { SimpleEntity } from "./SimpleEntity";

@Entity("password_reset")
export class PasswordResetEntity extends SimpleEntity {
  @Column({ type: "bigint" })
  userId!: number;

  @Column({ type: "text" })
  token!: string;

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @Column({ type: "timestamptz" })
  usedAt?: Date;
}

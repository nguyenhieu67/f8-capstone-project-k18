import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

export enum UserRole {
  ADMIN = "admin",
  GUEST = "guest",
  AUTHORIZED = "authorized",
}

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ type: "text" })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    enumName: "user_role",
  })
  role?: UserRole;

  @Column({ type: "text" })
  phone?: string;

  @Column({ type: "text" })
  avatar_url?: string;

  @Column({ type: "timestamptz" })
  last_login_at?: Date;
}

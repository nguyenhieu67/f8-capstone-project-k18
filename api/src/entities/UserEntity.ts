import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

export enum UserRole {
  ADMIN = "admin",
  AUTHORIZED = "authorized",
}

export enum UserLangCode {
  VI = "vi",
  EN = "en",
  JA = "ja",
}

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ type: "text" })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @Column({ type: "text" })
  firstName!: string;

  @Column({ type: "text" })
  lastName!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    enumName: "user_role",
  })
  role!: UserRole;

  @Column({ type: "text" })
  phone!: string;

  @Column({
    type: "enum",
    enum: UserLangCode,
    enumName: "user_lang_code",
  })
  langCode?: UserLangCode;

  @Column({ type: "text" })
  avatarUrl?: string;

  @Column({ type: "timestamptz" })
  lastLoginAt?: Date;
}

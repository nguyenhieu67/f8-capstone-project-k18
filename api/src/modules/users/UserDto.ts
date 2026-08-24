import { IsEnum, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { UserEntity, UserLangCode, UserRole } from "./UserEntity";

// ===== Request DTO =====

export class UserCreateDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserLangCode)
  langCode?: UserLangCode;
}

export class UserUpdateDto extends PartialType(UserCreateDto) {}

// ===== Response DTO =====

export type UserMeDto = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export const toUserMeDto = (user: UserEntity): UserMeDto => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
});

export type UserDetailDto = UserMeDto & {
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  langCode?: UserLangCode;
  lastLoginAt?: Date;
};

export const toUserDetailDto = (user: UserEntity): UserDetailDto => ({
  ...toUserMeDto(user),
  phone: user.phone,
  role: user.role,
  avatarUrl: user.avatarUrl,
  langCode: user.langCode,
  lastLoginAt: user.lastLoginAt,
});

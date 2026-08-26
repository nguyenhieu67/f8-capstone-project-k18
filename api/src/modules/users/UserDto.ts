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
};

export const toUserMeDto = (user: UserEntity): UserMeDto => ({
  id: user.id,
  email: user.email,
});

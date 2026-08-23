import { UserLangCode, UserRole } from "@/entities";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

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

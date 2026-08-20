import { UserRole } from "@/entities";
import { IsEnum, IsOptional, IsString } from "class-validator";

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
}

export class UserUpdateDto extends UserCreateDto {}

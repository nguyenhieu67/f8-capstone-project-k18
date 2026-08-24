import { IsEmail, IsString, MinLength } from "class-validator";

// ===== Request DTO (input, có validate) =====

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

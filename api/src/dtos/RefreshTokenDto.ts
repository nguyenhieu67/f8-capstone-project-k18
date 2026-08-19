import { IsString } from "class-validator";

export class RefreshTokenCreateDto {
  @IsString()
  refreshToken!: string;
}

export class RefreshTokenUpdateDto extends RefreshTokenCreateDto {}

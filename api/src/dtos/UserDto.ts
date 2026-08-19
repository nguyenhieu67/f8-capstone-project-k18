import { IsString } from "class-validator";

export class UserCreateDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;
}

export class UserUpdateDto extends UserCreateDto {}

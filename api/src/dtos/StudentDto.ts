import { IsNumber, IsString } from "class-validator";

export class StudentCreateDto {
  @IsNumber()
  lead_id!: number;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;
}

export class StudentUpdateDto extends StudentCreateDto {}

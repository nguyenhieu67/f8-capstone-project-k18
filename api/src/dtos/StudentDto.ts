import { IsNumber, IsString } from "class-validator";

export class StudentCreateDto {
  @IsNumber()
  leadId!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

export class StudentUpdateDto extends StudentCreateDto {}

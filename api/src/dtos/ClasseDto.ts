import { IsNumber, IsString } from "class-validator";

export class ClasseCreateDto {
  @IsNumber()
  trainerId!: number;

  @IsString()
  code!: string;

  @IsString()
  name!: string;
}

export class ClasseUpdateDto extends ClasseCreateDto {}

import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class ClasseCreateDto {
  @IsNumber()
  trainerId!: number;

  @IsString()
  code!: string;

  @IsString()
  name!: string;
}

export class ClasseUpdateDto extends PartialType(ClasseCreateDto) {}

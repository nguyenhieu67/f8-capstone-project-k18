import { IsNumber, IsString } from "class-validator";

export class ClasseCreateDto {
  @IsNumber()
  trainer_id!: number;

  @IsString()
  code!: string;

  @IsString()
  name!: string;
}

export class ClasseUpdateDto extends ClasseCreateDto {}

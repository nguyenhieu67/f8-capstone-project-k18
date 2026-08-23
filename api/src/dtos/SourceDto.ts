import { IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class SourceCreateDto {
  @IsString()
  name!: string;
}

export class SourceUpdateDto extends PartialType(SourceCreateDto) {}

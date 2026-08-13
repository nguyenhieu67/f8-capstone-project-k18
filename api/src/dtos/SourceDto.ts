import { IsString } from "class-validator";

export class SourceCreateDto {
  @IsString()
  name!: string;
}

export class SourceUpdateDto extends SourceCreateDto {}

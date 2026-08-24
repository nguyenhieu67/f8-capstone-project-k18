import { IsEnum, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { SourceEntity, SourceStatus } from "./SourceEntity";

// ===== Request DTO =====

export class SourceCreateDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(SourceStatus)
  status?: SourceStatus;
}

export class SourceUpdateDto extends PartialType(SourceCreateDto) {}

// ===== Response DTO =====

export type SourceDto = {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  status?: SourceStatus;
};

export const toSourceDto = (source: SourceEntity): SourceDto => ({
  id: source.id,
  name: source.name,
  icon: source.icon,
  color: source.color,
  status: source.status,
});

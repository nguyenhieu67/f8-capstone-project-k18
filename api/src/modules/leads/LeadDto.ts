import { IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class LeadCreateDto {
  @IsNumber()
  sellerId!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  classeId?: number;
}

export class LeadUpdateDto extends PartialType(LeadCreateDto) {}

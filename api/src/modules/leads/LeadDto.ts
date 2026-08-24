import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

// ===== Request DTO =====

export class LeadCreateDto {
  @IsNumber()
  sellerId!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

export class LeadUpdateDto extends PartialType(LeadCreateDto) {}

// ===== Response DTO =====

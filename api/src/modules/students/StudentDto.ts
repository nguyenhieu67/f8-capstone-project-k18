import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

// ===== Request DTO =====

export class StudentCreateDto {
  @IsNumber()
  leadId!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

export class StudentUpdateDto extends PartialType(StudentCreateDto) {}

// ===== Response DTO =====

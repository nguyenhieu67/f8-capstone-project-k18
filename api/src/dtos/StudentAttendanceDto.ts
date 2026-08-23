import { IsDate, IsEnum, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/swagger";

import { AttendanceStatus } from "@/entities";

export class StudentCreateDto {
  @IsNumber()
  classeId!: number;

  @IsNumber()
  studentId!: number;

  @IsDate()
  date!: Date;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}

export class StudentUpdateDto extends PartialType(StudentCreateDto) {}

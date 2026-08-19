import { IsDate, IsEnum, IsNumber } from "class-validator";

import { AttendanceStatus } from "@/entities";

export class StudentCreateDto {
  @IsNumber()
  classe_id!: number;

  @IsNumber()
  student_id!: number;

  @IsDate()
  date!: Date;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}

export class StudentUpdateDto extends StudentCreateDto {}

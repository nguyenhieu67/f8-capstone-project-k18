import { AttendanceStatus } from "@/entities";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";

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

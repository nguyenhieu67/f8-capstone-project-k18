import { IsString, IsEnum, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/swagger";

import { StaffAttendanceStatus } from "./StaffAttendanceEntity";

export class StaffAttendanceCreateDto {
  @IsNumber()
  employeeId!: number;

  @IsString()
  date!: string;

  @IsEnum(StaffAttendanceStatus)
  status!: StaffAttendanceStatus;
}

export class StaffAttendanceUpdateDto extends PartialType(StaffAttendanceCreateDto) {}

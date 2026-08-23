import { IsString, IsEnum } from "class-validator";
import { PartialType } from "@nestjs/swagger";

import { EmployeeRole } from "@/entities";

export class EmployeeCreateDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(EmployeeRole)
  role!: EmployeeRole;
}

export class EmployeeUpdateDto extends PartialType(EmployeeCreateDto) {}

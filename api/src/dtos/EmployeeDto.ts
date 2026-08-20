import { IsString, IsEnum } from "class-validator";

import { EmployeeRole } from "@/entities";

export class EmployeeCreateDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(EmployeeRole)
  role!: EmployeeRole;
}

export class EmployeeUpdateDto extends EmployeeCreateDto {}

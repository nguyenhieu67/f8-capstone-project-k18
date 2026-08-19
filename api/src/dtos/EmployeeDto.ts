import { IsString, IsEnum } from "class-validator";

import { EmployeeRole } from "@/entities";

export class EmployeeCreateDto {
  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsEnum(EmployeeRole)
  role!: EmployeeRole;
}

export class EmployeeUpdateDto extends EmployeeCreateDto {}

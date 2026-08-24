import { IsString, IsEnum } from "class-validator";
import { PartialType } from "@nestjs/swagger";

import { EmployeeEntity, EmployeeRole } from "./EmployeeEntity";

// ===== Request DTO =====

export class EmployeeCreateDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(EmployeeRole)
  role!: EmployeeRole;
}

export class EmployeeUpdateDto extends PartialType(EmployeeCreateDto) {}

// ===== Response DTO =====

export type EmployeeDto = {
  id: number;
  firstName: string;
  lastName: string;
  role: EmployeeRole;
  position?: string;
  phone?: string;
  salary?: string;
  commissionRate?: number;
  dependents?: number;
};

export const toEmployeeDto = (empeloyee: EmployeeEntity) => ({
  id: empeloyee.id,
  firstName: empeloyee.firstName,
  lastName: empeloyee.lastName,
  role: empeloyee.role,
  position: empeloyee.position,
  phone: empeloyee.phone,
  salary: empeloyee.salary,
  commissionRate: empeloyee.commissionRate,
  dependents: empeloyee.dependents,
});

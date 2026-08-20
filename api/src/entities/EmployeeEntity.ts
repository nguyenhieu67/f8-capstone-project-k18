import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

export enum EmployeeRole {
  TRAINER = "trainer",
  SALE = "sale",
  ACCOUNTANT = "accountant",
  MANAGER = "manager",
  ADMIN = "admin",
}

@Entity("employee")
export class EmployeeEntity extends BaseEntity {
  @Column({ type: "text" })
  firstName!: string;

  @Column({ type: "text" })
  lastName!: string;

  @Column({
    type: "enum",
    enum: EmployeeRole,
    enumName: "employee_role",
  })
  role!: EmployeeRole;

  @Column({ type: "text" })
  position?: string;

  @Column({ type: "text" })
  phone?: string;

  @Column({ type: "integer" })
  salary?: number;

  @Column({ type: "integer" })
  commissionRate?: number;

  @Column({ type: "bigint" })
  dependents?: number;
}

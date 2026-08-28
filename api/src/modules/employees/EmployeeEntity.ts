import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";
import { Expose } from "class-transformer";

export enum EmployeeRole {
  TRAINER = "trainer",
  SALE = "sale",
  ASSISTANT = "assistant",
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
  phone?: string;

  @Column({ type: "integer" })
  salary?: number;

  @Column({ type: "integer" })
  commissionRate?: number;

  @Column({ type: "bigint" })
  dependents?: number;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";
import { Expose } from "class-transformer";

@Entity("student")
export class StudentEntity extends BaseEntity {
  @Column({ type: "bigint" })
  leadId!: number;

  @Column({ type: "text" })
  firstName!: string;

  @Column({ type: "text" })
  lastName!: string;

  @Column({ type: "text" })
  phone?: string;

  @Column({ type: "int" })
  revenue?: number;

  @Column({ type: "timestamptz" })
  enrolledAt?: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

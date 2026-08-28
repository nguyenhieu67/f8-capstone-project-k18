import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";

@Entity("student")
export class StudentEntity extends BaseEntity {
  @Column({ type: "bigint" })
  leadId!: number;

  @Column({ type: "timestamptz" })
  enrolledAt?: Date;
}

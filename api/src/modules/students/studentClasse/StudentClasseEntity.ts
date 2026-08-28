import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";

export enum StudentClasseStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
}

@Entity("student_classe")
export class StudentClasseEntity extends BaseEntity {
  @Column({ type: "bigint" })
  studentId!: number;

  @Column({ type: "bigint" })
  classId!: number;

  @Column({ type: "timestamptz" })
  enrolledAt?: Date;

  @Column({ type: "bigint" })
  tuitionAmount?: number;

  @Column({
    type: "enum",
    enum: StudentClasseStatus,
    enumName: "student_class_status",
  })
  status?: StudentClasseStatus;
}

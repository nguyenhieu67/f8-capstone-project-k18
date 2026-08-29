import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";

export enum StudentAttendanceStatus {
  PERSENT = "present",
  ABSENT = "absent",
}

@Entity("student_attendance")
export class StudentAttendanceEntity extends BaseEntity {
  @Column({ type: "bigint" })
  studentId!: number;

  @Column({ type: "bigint" })
  classId!: number;

  @Column({ type: "timestamptz" })
  date!: Date;

  @Column({
    type: "enum",
    enum: StudentAttendanceStatus,
    enumName: "attendance_status",
  })
  status?: StudentAttendanceStatus;

  @Column({ type: "text" })
  note?: string;
}

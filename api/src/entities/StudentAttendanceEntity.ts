import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
}

@Entity("student")
export class StudentAttendanceEntity extends BaseEntity {
  @Column({ type: "bigint" })
  class_id!: number;

  @Column({ type: "bigint" })
  student_id!: number;

  @Column({ type: "timestamptz" })
  date!: Date;

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    enumName: "attendance_status",
  })
  status!: AttendanceStatus;

  @Column({ type: "text" })
  note?: string;
}

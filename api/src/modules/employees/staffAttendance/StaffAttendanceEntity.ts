import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";

export enum StaffAttendanceStatus {
  PRESENT = "present",
  LATE = "late",
  ABSENT = "absent",
  LEAVE = "leave",
}

@Entity("staff_attendance")
export class StaffAttendanceEntity extends BaseEntity {
  @Column({ type: "bigint" })
  employeeId!: number;

  @Column({ type: "date" })
  date!: Date;

  @Column({
    type: "enum",
    enum: StaffAttendanceStatus,
    enumName: "staff_status",
  })
  status!: StaffAttendanceStatus;

  @Column({ type: "text" })
  checkInTime?: string;

  @Column({ type: "text" })
  note?: string;
}

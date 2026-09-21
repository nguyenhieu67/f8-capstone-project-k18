export type ClassAttendanceStatus = "present" | "absent";

export interface ClassAttendanceRowI {
  id: number; // student_classe id
  studentId: number;
  fullName: string;
  phone: string | null;
  status: ClassAttendanceStatus | null;
  note: string | null;
}

export interface ClassAttendanceI {
  classId: number;
  date: string;
  hasRecords: boolean;
  items: ClassAttendanceRowI[];
}

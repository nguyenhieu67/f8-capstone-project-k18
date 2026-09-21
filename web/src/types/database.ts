// Classe
export type ClassStatus = "opening" | "ongoing" | "completed" | "closed";
export interface ClasseI {
  id?: number;
  code: string;
  name: string;
  trainerId?: number | string;
  schedule: string;
  tuition: number;
  status: ClassStatus;
}

// Employee
export type EmployeeRole =
  "trainer" | "sale" | "assistant" | "manager" | "admin";
export interface EmployeeI {
  id?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: EmployeeRole;
  phone: string;
  salary: number;
  commissionRate: number;
  dependents: number;
}

export type StaffAttendanceStatus = "present" | "late" | "absent" | "leave";

export interface StaffAttendanceI {
  id?: number;
  employeeId: number | string;
  date: Date | string;
  status: StaffAttendanceStatus;
  checkInTime?: string | null;
  note?: string;
}
// Source
export type SourceStatus = "active" | "inactive";
export interface SourceI {
  id?: number;
  name: string;
  color: string;
  icon: string;
  status: SourceStatus;
}

// Lead
export type LeadStatus =
  "new" | "contacted" | "qualified" | "converted" | "lost";
export interface LeadI {
  id?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  sellerId: number | string;
  classeId: number | string;
  sourceId: number | string;
  purpose: string;
  who: string;
  status: LeadStatus;
  rejectionReason: string | null;
  enrolledClasses?: LeadEnrolledClassI[];
}

export interface LeadEnrolledClassI {
  classId: number;
  status: StudentClasseStatus;
}

// Student
export interface StudentI {
  id?: number;
  leadId: number | string;
  enrolledAt: Date;
}
export type StudentClasseStatus = "active" | "completed" | "dropped";
export interface StudentClasseI {
  id?: number;
  studentId: number | string;
  classId: number | string;
  enrolledAt: Date;
  status: StudentClasseStatus;
  tuitionAmount: number;
}

export type StudentAttendanceStatus = "present" | "absent";
export interface StudentAttendanceI {
  id?: number;
  studentId: number | string;
  classId: number | string;
  date: Date | string;
  status: StudentAttendanceStatus;
  note: string;
}

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
  sellerId: string;
  classeId: string;
  sourceId: string;
  purpose: string;
  who: string;
  status: LeadStatus;
  rejectionReason: string;
}

// Student
export interface StudentI {
  id?: number;
  leadId: string;
  enrolledAt: Date;
}
export type StudentClasseStatusI = "active" | "completed" | "dropped";
export interface StudentClasseI {
  id?: number;
  studentId: string;
  classId: string;
  enrolledAt: Date;
  status: Date;
  tuitionAmount: number;
}

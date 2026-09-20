import type { EmployeeRole } from "./database";

export interface PayrollAttendanceI {
  present: number;
  late: number;
  absent: number;
  leave: number;
}

export interface PayrollRowI {
  id: number; // employee id
  fullName: string;
  role: EmployeeRole;
  dependents: number;
  attendance: PayrollAttendanceI;

  baseSalary: number;
  absentDeduction: number;
  salesVolume: number;
  ordersCount: number;
  commissionRate: number;
  commission: number;
  grossIncome: number;

  socialInsurance: number;
  unemploymentInsurance: number;
  healthInsurance: number;
  insuranceTotal: number;

  personalDeduction: number;
  dependentDeduction: number;
  taxableIncome: number;
  pitTax: number;
  netSalary: number;
}

export interface PayrollSummaryI {
  employeeCount: number;
  totalSalesVolume: number;
  totalCommission: number;
  totalGrossIncome: number;
  totalInsurance: number;
  totalPitTax: number;
  totalNetSalary: number;
}

export interface PayrollResultI {
  month: string;
  items: PayrollRowI[];
  summary: PayrollSummaryI;
}

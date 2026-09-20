import { EmployeeRole } from "../employees/EmployeeEntity";
import { PAYROLL_CONFIG } from "./payrollConfig";

export interface PayslipInput {
  role: EmployeeRole;
  salary: number;
  commissionRate: number;
  dependents: number;
  salesVolume: number;
  absentDays: number;
}

export interface PayslipResult {
  baseSalary: number;
  absentDeduction: number;
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

/** Thuế TNCN lũy tiến từng phần trên thu nhập tính thuế của 1 tháng */
export function calculatePit(taxableIncome: number): number {
  let tax = 0;
  let lower = 0;

  for (const { upTo, rate } of PAYROLL_CONFIG.PIT_BRACKETS) {
    if (taxableIncome <= lower) break;
    tax += (Math.min(taxableIncome, upTo) - lower) * rate;
    lower = upTo;
  }

  return Math.round(tax);
}

export function calculatePayslip(input: PayslipInput): PayslipResult {
  const { STANDARD_WORKING_DAYS, DEFAULT_COMMISSION_RATE, INSURANCE_RATES } = PAYROLL_CONFIG;

  const baseSalary = Math.max(0, input.salary);

  // Lương cơ bản thực nhận: vắng mặt (absent) bị trừ theo lương ngày.
  //   "late" và "leave" (nghỉ phép) không bị trừ.
  const absentDays = Math.min(Math.max(input.absentDays, 0), STANDARD_WORKING_DAYS);
  const absentDeduction = Math.round((baseSalary / STANDARD_WORKING_DAYS) * absentDays);

  // Hoa hồng: chỉ Sales mới có
  const commissionRate =
    input.role === EmployeeRole.SALE ? (input.commissionRate > 0 ? input.commissionRate : DEFAULT_COMMISSION_RATE) : 0;
  const commission = Math.round((input.salesVolume * commissionRate) / 100);

  // Gross
  const grossIncome = baseSalary - absentDeduction + commission;

  // Bảo hiểm bắt buộc — tính trên lương cơ bản hợp đồng (hoa hồng không đóng BH)
  const socialInsurance = Math.round(baseSalary * INSURANCE_RATES.social);
  const unemploymentInsurance = Math.round(baseSalary * INSURANCE_RATES.unemployment);
  const healthInsurance = Math.round(baseSalary * INSURANCE_RATES.health);
  const insuranceTotal = socialInsurance + unemploymentInsurance + healthInsurance;

  // Thuế TNCN
  const personalDeduction = PAYROLL_CONFIG.PERSONAL_DEDUCTION;
  const dependentDeduction = Math.max(0, input.dependents) * PAYROLL_CONFIG.DEPENDENT_DEDUCTION;
  const taxableIncome = Math.max(0, grossIncome - insuranceTotal - personalDeduction - dependentDeduction);
  const pitTax = calculatePit(taxableIncome);

  // NET
  const netSalary = grossIncome - insuranceTotal - pitTax;

  return {
    baseSalary,
    absentDeduction,
    commissionRate,
    commission,
    grossIncome,
    socialInsurance,
    unemploymentInsurance,
    healthInsurance,
    insuranceTotal,
    personalDeduction,
    dependentDeduction,
    taxableIncome,
    pitTax,
    netSalary,
  };
}

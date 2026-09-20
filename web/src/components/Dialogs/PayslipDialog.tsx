import { useTranslation } from "react-i18next";

import { EMPLOYEE_ROLE } from "@/constants/employeeRole";
import type { PayrollRowI } from "@/types/payroll";
import { formatCurrency } from "@/utils/format";
import { PrintIcon } from "../Icons";
import Dialog from "./Dialog";

interface PayslipDialogProps {
  isOpen: boolean;
  month: string;
  row: PayrollRowI | null;
  onClose: () => void;
  onPrint: (row: PayrollRowI) => void;
}

interface LineProps {
  label: string;
  value: string;
  bold?: boolean;
  negative?: boolean;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-crm-label-text border-crm-border mb-1 border-b pb-1 text-xs font-bold tracking-wider uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Line({ label, value, bold, negative }: LineProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span
        className={
          bold ? "text-crm-heading-text font-semibold" : "text-crm-label-text"
        }
      >
        {label}
      </span>
      <span
        className={`font-mono whitespace-nowrap ${
          negative
            ? "text-crm-danger"
            : bold
              ? "text-crm-heading-text font-bold"
              : "text-crm-table-row-text"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function PayslipDialog({
  isOpen,
  month,
  row,
  onClose,
  onPrint,
}: PayslipDialogProps) {
  const { t } = useTranslation();

  if (!row) return null;

  const minus = (value: number) => `-${formatCurrency(value)}`;
  const days = (value: number) => t("payrollPage.detail.days", { days: value });
  const roleLabel = EMPLOYEE_ROLE[row.role]?.label;

  return (
    <Dialog
      isOpen={isOpen}
      loading={false}
      title="payrollPage.detail.title"
      icon={<PrintIcon size="sm" />}
      widthSize="lg"
      buttonAction="common.button.printPayslip"
      onClose={onClose}
      onSubmit={async () => onPrint(row)}
    >
      <div className="mb-5 space-y-5">
        <div className="border-crm-border bg-crm-surface-soft rounded-xl border px-4 py-3">
          <p className="text-crm-heading-text text-lg font-bold">
            {row.fullName}
          </p>
          <p className="text-crm-label-text text-sm">
            <span className="font-mono">EMP{row.id}</span>
            {roleLabel && <> · {t(roleLabel)}</>} · {t("payrollPage.period")}{" "}
            {month}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-5">
            <Section title={t("payrollPage.detail.income")}>
              <Line
                label={t("payrollPage.detail.baseSalary")}
                value={formatCurrency(row.baseSalary)}
              />
              {row.absentDeduction > 0 && (
                <Line
                  label={t("payrollPage.detail.absentDeduction", {
                    days: row.attendance.absent,
                  })}
                  value={minus(row.absentDeduction)}
                  negative
                />
              )}
              {row.role === "sale" && (
                <>
                  <Line
                    label={t("payrollPage.detail.salesVolume", {
                      orders: row.ordersCount,
                    })}
                    value={formatCurrency(row.salesVolume)}
                  />
                  <Line
                    label={t("payrollPage.detail.commission", {
                      rate: row.commissionRate,
                    })}
                    value={formatCurrency(row.commission)}
                  />
                </>
              )}
              <Line
                label={t("payrollPage.detail.grossIncome")}
                value={formatCurrency(row.grossIncome)}
                bold
              />
            </Section>

            <Section title={t("payrollPage.detail.insurance")}>
              <Line
                label={t("payrollPage.detail.socialInsurance")}
                value={formatCurrency(row.socialInsurance)}
              />
              <Line
                label={t("payrollPage.detail.unemploymentInsurance")}
                value={formatCurrency(row.unemploymentInsurance)}
              />
              <Line
                label={t("payrollPage.detail.healthInsurance")}
                value={formatCurrency(row.healthInsurance)}
              />
              <Line
                label={t("payrollPage.detail.insuranceTotal")}
                value={formatCurrency(row.insuranceTotal)}
                bold
              />
            </Section>
          </div>

          <div className="space-y-5">
            <Section title={t("payrollPage.detail.tax")}>
              <Line
                label={t("payrollPage.detail.personalDeduction")}
                value={formatCurrency(row.personalDeduction)}
              />
              <Line
                label={t("payrollPage.detail.dependentDeduction", {
                  dependents: row.dependents,
                })}
                value={formatCurrency(row.dependentDeduction)}
              />
              <Line
                label={t("payrollPage.detail.taxableIncome")}
                value={formatCurrency(row.taxableIncome)}
              />
              <Line
                label={t("payrollPage.detail.pitTax")}
                value={formatCurrency(row.pitTax)}
                bold
              />
            </Section>

            <Section title={t("payrollPage.detail.attendance")}>
              <Line
                label={t("staffTimeKeepingPage.status.present")}
                value={days(row.attendance.present)}
              />
              <Line
                label={t("staffTimeKeepingPage.status.late")}
                value={days(row.attendance.late)}
              />
              <Line
                label={t("staffTimeKeepingPage.status.absent")}
                value={days(row.attendance.absent)}
              />
              <Line
                label={t("staffTimeKeepingPage.status.leave")}
                value={days(row.attendance.leave)}
              />
            </Section>
          </div>
        </div>

        <div className="bg-crm-success/10 flex items-center justify-between rounded-xl px-4 py-3">
          <span className="text-crm-heading-text font-semibold">
            {t("payrollPage.detail.netSalary")}
          </span>
          <span className="text-crm-success font-mono text-xl font-bold">
            {formatCurrency(row.netSalary)}
          </span>
        </div>
      </div>
    </Dialog>
  );
}

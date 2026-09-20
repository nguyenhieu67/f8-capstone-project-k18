import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { CardBase, StatCard } from "@/components/Card";
import { PayslipDialog } from "@/components/Dialogs";
import {
  ConisIcon,
  PrintIcon,
  ReceiptIcon,
  SackDollarIcon,
  ShieldHalvedIcon,
} from "@/components/Icons";
import Table from "@/components/Table";
import { EMPLOYEE_ROLE } from "@/constants/employeeRole";
import { useFetchData } from "@/hooks";
import { getPayroll } from "@/services/payroll";
import type { PayrollRowI } from "@/types/payroll";
import type { ColumnI } from "@/types/table";
import { formatCurrency } from "@/utils/format";
import { printPayroll } from "@/utils/printPayroll";

// "YYYY-MM" theo giờ máy người dùng
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default function Payroll() {
  const { t } = useTranslation();
  const currentMonth = useMemo(() => getCurrentMonth(), []);
  const [month, setMonth] = useState<string>(currentMonth);
  const [selectedRow, setSelectedRow] = useState<PayrollRowI | null>(null);

  const { data, loading } = useFetchData(() => getPayroll(month), [month]);
  const rows = useMemo(() => data?.items ?? [], [data?.items]);
  const summary = data?.summary;

  const columns: ColumnI<PayrollRowI>[] = useMemo(
    () => [
      {
        value: "employee",
        text: "common.tableHeader.employee",
        render: (r) => (
          <div className="whitespace-nowrap">
            <span className="text-crm-heading-text block text-[16px] font-bold">
              {r.fullName}
            </span>
            <span className="text-crm-label-text font-mono text-xs">
              EMP{r.id}
              {EMPLOYEE_ROLE[r.role] && ` · ${t(EMPLOYEE_ROLE[r.role].label)}`}
            </span>
          </div>
        ),
      },
      {
        value: "baseSalary",
        text: "common.tableHeader.baseSalary",
        render: (r) => (
          <div className="whitespace-nowrap">
            <span className="font-mono">{formatCurrency(r.baseSalary)}</span>
            {r.absentDeduction > 0 && (
              <span className="text-crm-danger block text-xs">
                {t("payrollPage.absentNote", {
                  days: r.attendance.absent,
                  amount: formatCurrency(r.absentDeduction),
                })}
              </span>
            )}
          </div>
        ),
      },
      {
        value: "salesVolume",
        text: "common.tableHeader.salesVolume",
        render: (r) =>
          r.role === "sale" ? (
            <div className="whitespace-nowrap">
              <span className="text-crm-primary font-mono">
                {formatCurrency(r.salesVolume)}
              </span>
              <span className="text-crm-label-text block text-xs">
                {t("payrollPage.ordersNote", { orders: r.ordersCount })}
              </span>
            </div>
          ) : (
            <span className="text-crm-label-text">—</span>
          ),
      },
      {
        value: "commission3Percent",
        text: "common.tableHeader.commission3Percent",
        render: (r) =>
          r.role === "sale" ? (
            <div className="whitespace-nowrap">
              <span className="text-crm-accent font-mono font-semibold">
                {formatCurrency(r.commission)}
              </span>
              <span className="text-crm-label-text block text-xs">
                {r.commissionRate}%
              </span>
            </div>
          ) : (
            <span className="text-crm-label-text">—</span>
          ),
      },
      {
        value: "grossIncome",
        text: "common.tableHeader.grossIncome",
        render: (r) => (
          <span className="font-mono font-semibold whitespace-nowrap">
            {formatCurrency(r.grossIncome)}
          </span>
        ),
      },
      {
        value: "insuranceTotal",
        text: "common.tableHeader.insuranceTotal",
        render: (r) => (
          <span className="font-mono whitespace-nowrap">
            {formatCurrency(r.insuranceTotal)}
          </span>
        ),
      },
      {
        value: "pitTax",
        text: "common.tableHeader.pitTax",
        render: (r) => (
          <span className="font-mono whitespace-nowrap">
            {formatCurrency(r.pitTax)}
          </span>
        ),
      },
      {
        value: "netSalary",
        text: "common.tableHeader.netSalary",
        render: (r) => (
          <span className="text-crm-success font-mono font-bold whitespace-nowrap">
            {formatCurrency(r.netSalary)}
          </span>
        ),
      },
      {
        value: "details",
        text: "common.tableHeader.details",
        render: (r) => (
          <Button
            outline
            small
            buttonTitle="common.tableHeader.details"
            leftIcon={<ReceiptIcon size="xs" />}
            onClick={() => setSelectedRow(r)}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <CardBase
        title="common.cardTitle.payrollAndTaxStatement"
        desc="common.cardDesc.payrollCalculation"
        className="flex items-center justify-between"
      >
        <div className="flex shrink-0 items-center gap-3">
          <input
            type="month"
            value={month}
            max={currentMonth}
            aria-label={t("payrollPage.period")}
            title={t("payrollPage.period")}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
            className="border-crm-border bg-crm-surface text-crm-heading-text focus:border-crm-primary rounded-xl border px-3 py-2 text-sm focus:outline-none"
          />
          <Button
            buttonTitle="common.button.printPayroll"
            info
            leftIcon={<PrintIcon />}
            disabled={rows.length === 0}
            onClick={() => printPayroll(rows, month, t)}
          />
        </div>
      </CardBase>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="payrollPage.summary.gross"
          value={formatCurrency(summary?.totalGrossIncome ?? 0)}
          icon={<SackDollarIcon />}
          status="primary"
        />
        <StatCard
          title="payrollPage.summary.insurance"
          value={formatCurrency(summary?.totalInsurance ?? 0)}
          icon={<ShieldHalvedIcon />}
          status="info"
        />
        <StatCard
          title="payrollPage.summary.pit"
          value={formatCurrency(summary?.totalPitTax ?? 0)}
          icon={<ReceiptIcon />}
          status="warning"
        />
        <StatCard
          title="payrollPage.summary.net"
          value={formatCurrency(summary?.totalNetSalary ?? 0)}
          icon={<ConisIcon />}
          status="success"
        />
      </div>

      <CardBase className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
        <Table<PayrollRowI>
          columns={columns}
          rows={rows}
          height="max-h-[calc(100vh-390px)] min-h-48"
        />
      </CardBase>

      <PayslipDialog
        isOpen={selectedRow !== null}
        month={month}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
        onPrint={(row) => printPayroll([row], month, t)}
      />
    </>
  );
}

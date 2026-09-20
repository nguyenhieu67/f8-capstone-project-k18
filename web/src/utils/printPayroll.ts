import type { TFunction } from "i18next";

import type { PayrollRowI } from "@/types/payroll";
import { formatCurrency } from "@/utils/format";

const PRINT_FRAME_ID = "payroll-print-frame";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ] as string,
  );

const sumBy = (rows: PayrollRowI[], pick: (row: PayrollRowI) => number) =>
  rows.reduce((total, row) => total + pick(row), 0);

export function printPayroll(rows: PayrollRowI[], month: string, t: TFunction) {
  if (rows.length === 0) return;

  const columns: {
    header: string;
    cell: (row: PayrollRowI) => string;
    total?: string;
  }[] = [
    {
      header: t("common.tableHeader.employee"),
      cell: (r) =>
        `<b>${escapeHtml(r.fullName)}</b><br/><small>EMP${r.id}</small>`,
      total: t("common.tableHeader.total"),
    },
    {
      header: t("common.tableHeader.baseSalary"),
      cell: (r) =>
        formatCurrency(r.baseSalary) +
        (r.absentDeduction > 0
          ? `<br/><small>-${formatCurrency(r.absentDeduction)}</small>`
          : ""),
      total: formatCurrency(sumBy(rows, (r) => r.baseSalary)),
    },
    {
      header: t("common.tableHeader.salesVolume"),
      cell: (r) => formatCurrency(r.salesVolume),
      total: formatCurrency(sumBy(rows, (r) => r.salesVolume)),
    },
    {
      header: t("common.tableHeader.commission"),
      cell: (r) => formatCurrency(r.commission),
      total: formatCurrency(sumBy(rows, (r) => r.commission)),
    },
    {
      header: t("common.tableHeader.grossIncome"),
      cell: (r) => formatCurrency(r.grossIncome),
      total: formatCurrency(sumBy(rows, (r) => r.grossIncome)),
    },
    {
      header: t("common.tableHeader.insuranceTotal"),
      cell: (r) => formatCurrency(r.insuranceTotal),
      total: formatCurrency(sumBy(rows, (r) => r.insuranceTotal)),
    },
    {
      header: t("common.tableHeader.pitTax"),
      cell: (r) => formatCurrency(r.pitTax),
      total: formatCurrency(sumBy(rows, (r) => r.pitTax)),
    },
    {
      header: t("common.tableHeader.netSalary"),
      cell: (r) => `<b>${formatCurrency(r.netSalary)}</b>`,
      total: `<b>${formatCurrency(sumBy(rows, (r) => r.netSalary))}</b>`,
    },
  ];

  const head = columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${c.cell(row)}</td>`).join("")}</tr>`,
    )
    .join("");
  const foot =
    rows.length > 1
      ? `<tr class="total">${columns.map((c) => `<td>${c.total ?? ""}</td>`).join("")}</tr>`
      : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(t("common.cardTitle.payrollAndTaxStatement"))} ${month}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; margin: 24px; }
      h1 { font-size: 18px; margin: 0 0 4px; }
      p { margin: 0 0 16px; color: #64748b; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; white-space: nowrap; }
      th { background: #f1f5f9; text-transform: uppercase; font-size: 11px; }
      th:first-child, td:first-child { text-align: left; }
      tr.total td { background: #f8fafc; font-weight: bold; }
      @page { size: A4 landscape; margin: 12mm; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(t("common.cardTitle.payrollAndTaxStatement"))}</h1>
    <p>${escapeHtml(t("payrollPage.period"))}: ${month}</p>
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}${foot}</tbody>
    </table>
  </body>
</html>`;

  document.getElementById(PRINT_FRAME_ID)?.remove();

  const iframe = document.createElement("iframe");
  iframe.id = PRINT_FRAME_ID;
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) return;
    frameWindow.addEventListener("afterprint", () => iframe.remove());
    frameWindow.focus();
    frameWindow.print();
  };
  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}

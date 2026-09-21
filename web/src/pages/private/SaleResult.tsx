import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import Table from "@/components/Table";
import { useFetchData, usePagination } from "@/hooks";
import { getSaleResults } from "@/services/saleResult";
import type { SaleResultRowI } from "@/types/saleResult";
import type { ColumnI } from "@/types/table";
import { formatCurrency } from "@/utils/format";

export default function SaleResult() {
  const { t, i18n } = useTranslation();
  const { page, limit, onPageChange, onLimitChange } = usePagination(10);
  const [month, setMonth] = useState<string>("");

  const { data, loading } = useFetchData(
    () => getSaleResults({ page, limit, month: month || undefined }),
    [page, limit, month],
  );

  const rows = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;

  const handleMonthChange = (value: string) => {
    setMonth(value);
    onPageChange(1);
  };

  const columns: ColumnI<SaleResultRowI>[] = useMemo(
    () => [
      {
        value: "student",
        text: "common.tableHeader.student",
        render: (r) => (
          <span className="text-crm-heading-text text-[16px] font-bold">
            {r.studentName}
          </span>
        ),
      },
      {
        value: "phone",
        text: "common.tableHeader.phone",
        render: (r) => (
          <span className="text-crm-info font-mono">{r.phone ?? ""}</span>
        ),
      },
      {
        value: "adSource",
        text: "common.tableHeader.adSource",
        render: (r) => <span className="font-mono">{r.sourceName ?? ""}</span>,
      },
      {
        value: "purposeAndTarget",
        text: "common.tableHeader.purposeAndTarget",
        render: (r) =>
          r.purpose && r.who ? (
            <>
              <span>{r.purpose}</span>
              <span className="block text-xs text-slate-500">{r.who}</span>
            </>
          ) : (
            <span className="text-crm-danger font-medium">-</span>
          ),
      },
      {
        value: "closedBySeller",
        text: "common.tableHeader.closedBySeller",
        render: (r) => (
          <span className="font-semibold">{r.sellerName ?? ""}</span>
        ),
      },
      {
        value: "class",
        text: "common.tableHeader.class",
        render: (r) => (
          <span className="text-crm-accent font-semibold">
            {r.className ?? ""}
          </span>
        ),
      },
      {
        value: "enrolledDate",
        text: "common.tableHeader.enrolledDate",
        render: (r) => (
          <span className="whitespace-nowrap">
            {new Date(r.enrolledAt).toLocaleDateString(i18n.language)}
          </span>
        ),
      },
      {
        value: "revenue",
        text: "common.tableHeader.revenue",
        render: (r) => (
          <span className="text-crm-primary font-mono whitespace-nowrap">
            {formatCurrency(r.tuitionAmount)}
          </span>
        ),
      },
    ],
    [i18n.language],
  );

  return (
    <>
      <CardBase
        title="common.cardTitle.salesAndRevenueStats"
        desc="common.cardDesc.enrolledStudents"
        className="flex items-center justify-between"
      >
        <div className="flex shrink-0 items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              aria-label={t("saleResultPage.period")}
              title={t("saleResultPage.period")}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="border-crm-border bg-crm-surface text-crm-heading-text focus:border-crm-primary rounded-xl border px-3 py-2 text-sm focus:outline-none"
            />
            {month && (
              <Button
                text
                buttonTitle="saleResultPage.allTime"
                onClick={() => handleMonthChange("")}
              />
            )}
          </div>

          <div className="flex flex-col items-end justify-center">
            <span className="text-crm-success font-mono text-2xl">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-crm-label-text text-sm">
              {t("saleResultPage.totalRevenue")}
            </span>
          </div>
        </div>
      </CardBase>

      <CardBase className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
        <Table<SaleResultRowI>
          columns={columns}
          rows={rows}
          height="max-h-[calc(100vh-340px)]"
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </CardBase>
    </>
  );
}

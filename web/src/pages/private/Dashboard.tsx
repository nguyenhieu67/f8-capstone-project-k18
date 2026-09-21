import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CardBase, StatCard } from "@/components/Card";
import {
  ConisIcon,
  MedalIcon,
  SackDollarIcon,
  TriangleExclIcon,
  UserCheckIcon,
  UserViewFinderIcon,
} from "@/components/Icons";
import Table from "@/components/Table";
import { useFetchData } from "@/hooks";
import { getDashboard } from "@/services/dashboard";
import type { DashboardLeaderboardRowI } from "@/types/dashboard";
import type { ColumnI } from "@/types/table";
import { formatCurrency } from "@/utils/format";

const formatChange = (percent: number | null | undefined) => {
  if (percent === null || percent === undefined) return "";
  return `${percent > 0 ? "+" : ""}${percent}% `;
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { data, loading } = useFetchData(() => getDashboard(), []);

  const leaderboard = useMemo(() => data?.leaderboard ?? [], [data]);
  const rejectionReasons = useMemo(() => data?.rejectionReasons ?? [], [data]);

  const columns: ColumnI<DashboardLeaderboardRowI>[] = useMemo(
    () => [
      {
        value: "employee",
        text: "common.tableHeader.employee",
        render: (r) => {
          const rank = leaderboard.findIndex((row) => row.id === r.id) + 1;
          return (
            <span className="text-crm-heading-text font-bold whitespace-nowrap">
              <span className="text-crm-label-text mr-2 font-mono text-xs">
                #{rank}
              </span>
              {r.fullName}
            </span>
          );
        },
      },
      {
        value: "ordersCount",
        text: "common.tableHeader.ordersCount",
        render: (r) => <span className="font-mono">{r.ordersCount}</span>,
      },
      {
        value: "salesVolume",
        text: "common.tableHeader.salesVolume",
        render: (r) => (
          <span className="text-crm-primary font-mono whitespace-nowrap">
            {formatCurrency(r.salesVolume)}
          </span>
        ),
      },
      {
        value: "commission3Percent",
        text: "common.tableHeader.commission3Percent",
        render: (r) => (
          <div className="whitespace-nowrap">
            <span className="text-crm-accent font-mono font-semibold">
              {formatCurrency(r.commission)}
            </span>
            <span className="text-crm-label-text block text-xs">
              {r.commissionRate}%
            </span>
          </div>
        ),
      },
    ],
    [leaderboard],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="common.summaryTitle.totalRevenue"
          value={formatCurrency(data?.revenue.current ?? 0)}
          subtextPrefix={formatChange(data?.revenue.changePercent)}
          subtext="common.summaryDesc.comparedToLastMonth"
          icon={<SackDollarIcon />}
          status="success"
        />
        <StatCard
          title="common.summaryTitle.totalLeads"
          value={String(data?.leads.total ?? 0)}
          subtext="common.summaryDesc.leadSources"
          icon={<UserViewFinderIcon />}
          status="primary"
        />
        <StatCard
          title="common.summaryTitle.registeredStudents"
          value={String(data?.registeredStudents ?? 0)}
          subtextPrefix={`${data?.leads.conversionRate ?? 0}% `}
          subtext="common.summaryDesc.conversionRate"
          icon={<UserCheckIcon />}
          status="info"
        />
        <StatCard
          title="common.summaryTitle.totalPayrollAndCommission"
          value={formatCurrency(data?.payrollTotal ?? 0)}
          subtext="common.summaryDesc.salaryAndCommissionDetail"
          icon={<ConisIcon />}
          status="warning"
        />
      </div>

      <div
        className={`grid grid-cols-1 gap-6 transition-opacity lg:grid-cols-2 ${
          loading ? "opacity-60" : ""
        }`}
      >
        <CardBase
          title="common.cardTitle.salesLeaderboard"
          icon={<MedalIcon className="text-crm-warning" />}
        >
          <div className="mt-4">
            <Table<DashboardLeaderboardRowI>
              columns={columns}
              rows={leaderboard}
              height="max-h-80"
            />
          </div>
        </CardBase>

        <CardBase
          title="common.cardTitle.commonRejectionReasons"
          icon={<TriangleExclIcon className="text-crm-danger" />}
        >
          <div className="mt-4 space-y-4">
            {rejectionReasons.length === 0 ? (
              <p className="text-crm-label-text py-6 text-center text-sm">
                {t("dashboardPage.noRejections")}
              </p>
            ) : (
              rejectionReasons.map((item) => (
                <div key={item.reason}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="text-crm-heading-text font-medium">
                      {item.reason}
                    </span>
                    <span className="text-crm-label-text font-mono whitespace-nowrap">
                      {item.count} · {item.percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-crm-danger h-full rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBase>
      </div>
    </>
  );
}

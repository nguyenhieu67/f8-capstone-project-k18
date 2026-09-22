import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { CardBase, StatCard } from "@/components/Card";
import {
  ArrowTrendUpIcon,
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
import type {
  DashboardLeaderboardRowI,
  DashboardTrendPointI,
} from "@/types/dashboard";
import type { ColumnI } from "@/types/table";
import {
  formatCompactNumber,
  formatCurrency,
  formatMonthShort,
} from "@/utils/format";

const formatChange = (percent: number | null | undefined) => {
  if (percent === null || percent === undefined) return "";
  return `${percent > 0 ? "+" : ""}${percent}% `;
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { data, loading } = useFetchData(() => getDashboard(), []);

  const leaderboard = useMemo(() => data?.leaderboard ?? [], [data]);
  const rejectionReasons = useMemo(() => data?.rejectionReasons ?? [], [data]);
  const trend: DashboardTrendPointI[] = useMemo(
    () => data?.trend ?? [],
    [data],
  );

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

      <CardBase
        title="dashboardPage.trend.title"
        desc="dashboardPage.trend.desc"
        icon={<ArrowTrendUpIcon className="text-crm-primary" size="sm" />}
        className={`transition-opacity ${loading ? "opacity-60" : ""}`}
      >
        <div className="mt-4 h-80 w-full overflow-hidden">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            debounce={50}
          >
            <LineChart
              data={trend}
              margin={{ top: 5, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--crm-border)" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthShort}
                tick={{ fill: "var(--crm-label-text)", fontSize: 12 }}
                axisLine={{ stroke: "var(--crm-border)" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                tickFormatter={(value: number) =>
                  formatCompactNumber(value, i18n.language)
                }
                tick={{ fill: "var(--crm-label-text)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                allowDecimals={false}
                tick={{ fill: "var(--crm-label-text)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                labelFormatter={(label) =>
                  typeof label === "string" ? formatMonthShort(label) : label
                }
                formatter={(value, name) => [
                  name === "revenue" ? formatCurrency(Number(value)) : value,
                  t(`dashboardPage.trend.${name}`),
                ]}
                allowEscapeViewBox={{ x: false, y: false }}
                contentStyle={{
                  backgroundColor: "var(--crm-surface)",
                  borderColor: "var(--crm-border)",
                  borderRadius: 12,
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--crm-heading-text)" }}
                wrapperStyle={{ pointerEvents: "none" }}
              />
              <Legend
                formatter={(key: string) => t(`dashboardPage.trend.${key}`)}
                wrapperStyle={{ fontSize: 13 }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="var(--crm-primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="leadsCount"
                name="leadsCount"
                stroke="var(--crm-info)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="registeredStudents"
                name="registeredStudents"
                stroke="var(--crm-success)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBase>

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

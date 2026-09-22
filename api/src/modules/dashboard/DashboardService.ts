import { AppDataSource } from "@/config";
import { EmployeeRole } from "../employees/EmployeeEntity";
import PayrollService from "../payroll/PayrollService";
import { getMonthRange, getPreviousMonth } from "@/utils";

const TREND_MONTHS = 6;

const TREND_SQL = `
  WITH months AS (
    SELECT generate_series($1::date, $2::date, interval '1 month')::date AS month_start
  ),
  revenue AS (
    SELECT date_trunc('month', (COALESCE(sc.enrolled_at, sc.created_at) AT TIME ZONE 'Asia/Ho_Chi_Minh'))::date AS month_start,
           SUM(sc.tuition_amount) AS revenue
    FROM student_classe sc
    JOIN student s ON s.id = sc.student_id AND s.is_active = true
    JOIN lead l ON l.id = s.lead_id AND l.is_active = true
    WHERE sc.is_active = true
      AND COALESCE(sc.enrolled_at, sc.created_at) >= $3 AND COALESCE(sc.enrolled_at, sc.created_at) < $4
    GROUP BY 1
  ),
  leads AS (
    SELECT date_trunc('month', (created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'))::date AS month_start,
           COUNT(*) AS leads_count
    FROM lead
    WHERE is_active = true AND created_at >= $3 AND created_at < $4
    GROUP BY 1
  ),
  students AS (
    SELECT date_trunc('month', (enrolled_at AT TIME ZONE 'Asia/Ho_Chi_Minh'))::date AS month_start,
           COUNT(*) AS registered_students
    FROM student
    WHERE is_active = true AND enrolled_at >= $3 AND enrolled_at < $4
    GROUP BY 1
  )
  SELECT to_char(m.month_start, 'YYYY-MM') AS "month",
         COALESCE(r.revenue, 0) AS "revenue",
         COALESCE(l.leads_count, 0) AS "leadsCount",
         COALESCE(st.registered_students, 0) AS "registeredStudents"
  FROM months m
  LEFT JOIN revenue r ON r.month_start = m.month_start
  LEFT JOIN leads l ON l.month_start = m.month_start
  LEFT JOIN students st ON st.month_start = m.month_start
  ORDER BY m.month_start
`;

const REVENUE_SQL = `
  SELECT
    COALESCE(SUM(sc.tuition_amount) FILTER (
      WHERE COALESCE(sc.enrolled_at, sc.created_at) >= $1 AND COALESCE(sc.enrolled_at, sc.created_at) < $2
    ), 0) AS "current",
    COALESCE(SUM(sc.tuition_amount) FILTER (
      WHERE COALESCE(sc.enrolled_at, sc.created_at) >= $3 AND COALESCE(sc.enrolled_at, sc.created_at) < $4
    ), 0) AS "previous"
  FROM student_classe sc
  JOIN student s ON s.id = sc.student_id AND s.is_active = true
  JOIN lead l ON l.id = s.lead_id AND l.is_active = true
  WHERE sc.is_active = true
    AND COALESCE(sc.enrolled_at, sc.created_at) >= $3
    AND COALESCE(sc.enrolled_at, sc.created_at) < $2
`;

const OVERVIEW_SQL = `
  SELECT
    (SELECT COUNT(*) FROM lead
      WHERE is_active = true AND created_at >= $1 AND created_at < $2) AS "totalLeads",
    (SELECT COUNT(*) FROM lead
      WHERE is_active = true AND status = 'converted' AND created_at >= $1 AND created_at < $2) AS "convertedLeads",
    (SELECT COUNT(*) FROM student
      WHERE is_active = true AND enrolled_at >= $1 AND enrolled_at < $2) AS "registeredStudents"
`;

const REJECTION_SQL = `
  SELECT TRIM(rejection_reason) AS "reason",
         COUNT(*) AS "count",
         SUM(COUNT(*)) OVER () AS "total"
  FROM lead
  WHERE is_active = true
    AND status = 'lost'
    AND COALESCE(TRIM(rejection_reason), '') <> ''
    AND created_at >= $1 AND created_at < $2
  GROUP BY TRIM(rejection_reason)
  ORDER BY COUNT(*) DESC, TRIM(rejection_reason)
  LIMIT 5
`;

const LEADERBOARD_SIZE = 5;

const round1 = (n: number) => Math.round(n * 10) / 10;

function subtractMonths(month: string, n: number): string {
  let result = month;
  for (let i = 0; i < n; i++) result = getPreviousMonth(result);
  return result;
}

class DashboardService {
  async getDashboard(month: string) {
    const current = getMonthRange(month);
    const previous = getMonthRange(getPreviousMonth(month));

    const earliestMonth = subtractMonths(month, TREND_MONTHS - 1);
    const earliestRange = getMonthRange(earliestMonth);

    const [[revenue], [overview], rejectionRows, payroll, trendRows] = await Promise.all([
      AppDataSource.query(REVENUE_SQL, [current.start, current.end, previous.start, previous.end]) as Promise<any[]>,
      AppDataSource.query(OVERVIEW_SQL, [current.start, current.end]) as Promise<any[]>,
      AppDataSource.query(REJECTION_SQL, [current.start, current.end]) as Promise<any[]>,
      PayrollService.getMonthlyPayroll(month),
      AppDataSource.query(TREND_SQL, [
        earliestRange.startDate,
        current.startDate,
        earliestRange.start,
        current.end,
      ]) as Promise<any[]>,
    ]);

    const currentRevenue = Number(revenue.current);
    const previousRevenue = Number(revenue.previous);
    const totalLeads = Number(overview.totalLeads);
    const convertedLeads = Number(overview.convertedLeads);

    const leaderboard = payroll.items
      .filter((row) => row.role === EmployeeRole.SALE)
      .sort((a, b) => b.salesVolume - a.salesVolume)
      .slice(0, LEADERBOARD_SIZE)
      .map((row) => ({
        id: row.id,
        fullName: row.fullName,
        ordersCount: row.ordersCount,
        salesVolume: row.salesVolume,
        commissionRate: row.commissionRate,
        commission: row.commission,
      }));

    return {
      month,
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        changePercent:
          previousRevenue > 0 ? round1(((currentRevenue - previousRevenue) / previousRevenue) * 100) : null,
      },
      leads: {
        total: totalLeads,
        converted: convertedLeads,
        conversionRate: totalLeads > 0 ? round1((convertedLeads / totalLeads) * 100) : 0,
      },
      registeredStudents: Number(overview.registeredStudents),
      payrollTotal: payroll.summary.totalGrossIncome,
      leaderboard,
      rejectionReasons: rejectionRows.map((r) => ({
        reason: r.reason as string,
        count: Number(r.count),
        percent: round1((Number(r.count) / Number(r.total)) * 100),
      })),
      trend: trendRows.map((r) => ({
        month: r.month as string,
        revenue: Number(r.revenue),
        leadsCount: Number(r.leadsCount),
        registeredStudents: Number(r.registeredStudents),
      })),
    };
  }
}

export default new DashboardService();

import { AppDataSource } from "@/config";
import { EmployeeRole } from "../employees/EmployeeEntity";
import PayrollService from "../payroll/PayrollService";
import { getMonthRange, getPreviousMonth } from "@/utils";

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

class DashboardService {
  async getDashboard(month: string) {
    const current = getMonthRange(month);
    const previous = getMonthRange(getPreviousMonth(month));

    const [[revenue], [overview], rejectionRows, payroll] = await Promise.all([
      AppDataSource.query(REVENUE_SQL, [current.start, current.end, previous.start, previous.end]) as Promise<any[]>,
      AppDataSource.query(OVERVIEW_SQL, [current.start, current.end]) as Promise<any[]>,
      AppDataSource.query(REJECTION_SQL, [current.start, current.end]) as Promise<any[]>,
      PayrollService.getMonthlyPayroll(month),
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
    };
  }
}

export default new DashboardService();

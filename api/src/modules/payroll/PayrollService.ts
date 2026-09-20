import { AppDataSource } from "@/config";
import { EmployeeEntity } from "../employees/EmployeeEntity";
import { calculatePayslip } from "./payrollCalculator";

const TIMEZONE = "Asia/Ho_Chi_Minh";

const SALES_SQL = `
  SELECT l.seller_id AS "sellerId",
         COALESCE(SUM(sc.tuition_amount), 0) AS "salesVolume",
         COUNT(*) AS "ordersCount"
  FROM student_classe sc
  JOIN student s ON s.id = sc.student_id AND s.is_active = true
  JOIN lead l ON l.id = s.lead_id AND l.is_active = true
  WHERE sc.is_active = true
    AND l.seller_id IS NOT NULL
    AND COALESCE(sc.enrolled_at, sc.created_at) >= $1
    AND COALESCE(sc.enrolled_at, sc.created_at) < $2
  GROUP BY l.seller_id
`;

const ATTENDANCE_SQL = `
  SELECT employee_id AS "employeeId",
         COUNT(*) FILTER (WHERE status = 'present') AS "present",
         COUNT(*) FILTER (WHERE status = 'late') AS "late",
         COUNT(*) FILTER (WHERE status = 'absent') AS "absent",
         COUNT(*) FILTER (WHERE status = 'leave') AS "leave"
  FROM staff_attendance
  WHERE is_active = true
    AND "date" >= $1::date
    AND "date" < $2::date
  GROUP BY employee_id
`;

const pad = (n: number) => String(n).padStart(2, "0");

function getMonthRange(month: string) {
  const [year, m] = month.split("-").map(Number);
  const nextYear = m === 12 ? year + 1 : year;
  const nextMonth = m === 12 ? 1 : m + 1;

  const startDate = `${year}-${pad(m)}-01`;
  const endDate = `${nextYear}-${pad(nextMonth)}-01`;

  return {
    startDate,
    endDate,
    // Ranh giới tháng tính theo giờ Việt Nam
    start: new Date(`${startDate}T00:00:00+07:00`),
    end: new Date(`${endDate}T00:00:00+07:00`),
  };
}

class PayrollService {
  getCurrentMonth() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    return `${year}-${month}`;
  }

  async getMonthlyPayroll(month: string) {
    const { startDate, endDate, start, end } = getMonthRange(month);

    const [employees, salesRows, attendanceRows] = await Promise.all([
      AppDataSource.getRepository(EmployeeEntity).find({
        where: { isActive: true },
        order: { id: "ASC" },
      }),
      AppDataSource.query(SALES_SQL, [start, end]) as Promise<any[]>,
      AppDataSource.query(ATTENDANCE_SQL, [startDate, endDate]) as Promise<any[]>,
    ]);

    const salesMap = new Map(
      salesRows.map((r) => [
        Number(r.sellerId),
        { salesVolume: Number(r.salesVolume), ordersCount: Number(r.ordersCount) },
      ]),
    );
    const attendanceMap = new Map(
      attendanceRows.map((r) => [
        Number(r.employeeId),
        {
          present: Number(r.present),
          late: Number(r.late),
          absent: Number(r.absent),
          leave: Number(r.leave),
        },
      ]),
    );

    const items = employees.map((emp) => {
      const sales = salesMap.get(emp.id) ?? { salesVolume: 0, ordersCount: 0 };
      const attendance = attendanceMap.get(emp.id) ?? { present: 0, late: 0, absent: 0, leave: 0 };
      const dependents = Number(emp.dependents ?? 0);

      const payslip = calculatePayslip({
        role: emp.role,
        salary: Number(emp.salary ?? 0),
        commissionRate: Number(emp.commissionRate ?? 0),
        dependents,
        salesVolume: sales.salesVolume,
        absentDays: attendance.absent,
      });

      return {
        id: emp.id,
        fullName: `${emp.firstName} ${emp.lastName}`,
        role: emp.role,
        dependents,
        attendance,
        salesVolume: sales.salesVolume,
        ordersCount: sales.ordersCount,
        ...payslip,
      };
    });

    const sum = (pick: (row: (typeof items)[number]) => number) => items.reduce((total, row) => total + pick(row), 0);

    return {
      month,
      items,
      summary: {
        employeeCount: items.length,
        totalSalesVolume: sum((r) => r.salesVolume),
        totalCommission: sum((r) => r.commission),
        totalGrossIncome: sum((r) => r.grossIncome),
        totalInsurance: sum((r) => r.insuranceTotal),
        totalPitTax: sum((r) => r.pitTax),
        totalNetSalary: sum((r) => r.netSalary),
      },
    };
  }
}

export default new PayrollService();

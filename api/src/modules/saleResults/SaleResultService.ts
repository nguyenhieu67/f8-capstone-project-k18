import { AppDataSource } from "@/config";
import { getMonthRange } from "@/utils";

const ENROLLED_AT = "COALESCE(sc.enrolled_at, sc.created_at)";

const BASE_FROM = `
  FROM student_classe sc
  JOIN student s ON s.id = sc.student_id AND s.is_active = true
  JOIN lead l ON l.id = s.lead_id AND l.is_active = true
`;

const DETAIL_JOINS = `
  LEFT JOIN source src ON src.id = l.source_id
  LEFT JOIN employee e ON e.id = l.seller_id
  LEFT JOIN classe c ON c.id = sc.class_id
`;

interface SaleResultQuery {
  month?: string;
  page: number;
  limit: number;
}

class SaleResultService {
  async getSaleResults({ month, page, limit }: SaleResultQuery) {
    const params: unknown[] = [];
    let where = "WHERE sc.is_active = true";

    if (month) {
      const { start, end } = getMonthRange(month);
      params.push(start, end);
      where += ` AND ${ENROLLED_AT} >= $1 AND ${ENROLLED_AT} < $2`;
    }

    const rowsSql = `
      SELECT sc.id,
             ${ENROLLED_AT} AS "enrolledAt",
             sc.tuition_amount AS "tuitionAmount",
             TRIM(CONCAT_WS(' ', l.first_name, l.last_name)) AS "studentName",
             l.phone AS "phone",
             l.purpose AS "purpose",
             l.who AS "who",
             src.name AS "sourceName",
             TRIM(CONCAT_WS(' ', e.first_name, e.last_name)) AS "sellerName",
             c.name AS "className"
      ${BASE_FROM}
      ${DETAIL_JOINS}
      ${where}
      ORDER BY ${ENROLLED_AT} DESC, sc.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const totalsSql = `
      SELECT COUNT(*) AS "total",
             COALESCE(SUM(sc.tuition_amount), 0) AS "totalRevenue"
      ${BASE_FROM}
      ${where}
    `;

    const [rows, [totals]] = await Promise.all([
      AppDataSource.query(rowsSql, [...params, limit, (page - 1) * limit]) as Promise<any[]>,
      AppDataSource.query(totalsSql, params) as Promise<any[]>,
    ]);

    return {
      items: rows.map((r) => ({
        id: Number(r.id),
        enrolledAt: r.enrolledAt as Date,
        tuitionAmount: Number(r.tuitionAmount),
        studentName: (r.studentName as string) ?? "",
        phone: (r.phone as string | null) ?? null,
        purpose: (r.purpose as string | null) ?? null,
        who: (r.who as string | null) ?? null,
        sourceName: (r.sourceName as string | null) ?? null,
        sellerName: (r.sellerName as string | null) || null,
        className: (r.className as string | null) ?? null,
      })),
      total: Number(totals.total),
      page,
      limit,
      month: month ?? null,

      totalRevenue: Number(totals.totalRevenue),
    };
  }
}

export default new SaleResultService();

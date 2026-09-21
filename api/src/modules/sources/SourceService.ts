import { BaseService } from "@/common";
import { AppDataSource } from "@/config";
import { SourceEntity } from "./SourceEntity";

const SOURCE_STATS_SQL = `
  SELECT src.id AS "id",
         src.name AS "name",
         src.color AS "color",
         src.icon AS "icon",
         src.status AS "status",
         COALESCE(l.leads_count, 0) AS "leadsCount",
         COALESCE(e.converted_count, 0) AS "convertedCount",
         COALESCE(e.revenue, 0) AS "revenue"
  FROM source src
  LEFT JOIN (
    SELECT source_id, COUNT(*) AS leads_count
    FROM lead
    WHERE is_active = true
    GROUP BY source_id
  ) l ON l.source_id = src.id
  LEFT JOIN (
    SELECT ld.source_id,
           COUNT(DISTINCT s.id) AS converted_count,
           SUM(sc.tuition_amount) AS revenue
    FROM student_classe sc
    JOIN student s ON s.id = sc.student_id AND s.is_active = true
    JOIN lead ld ON ld.id = s.lead_id AND ld.is_active = true
    WHERE sc.is_active = true
    GROUP BY ld.source_id
  ) e ON e.source_id = src.id
  WHERE src.is_active = true
  ORDER BY src.id ASC
`;

class SourceService extends BaseService {
  async getStats() {
    const rows = (await AppDataSource.query(SOURCE_STATS_SQL)) as Record<string, string>[];

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      color: row.color,
      icon: row.icon,
      status: row.status,
      leadsCount: Number(row.leadsCount),
      convertedCount: Number(row.convertedCount),
      revenue: Number(row.revenue),
    }));
  }
}

export default new SourceService(SourceEntity);

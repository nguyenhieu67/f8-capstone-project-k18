import { AppDataSource } from "@/config";

const ROSTER_SQL = `
  SELECT sc.id AS "id",
         sc.student_id AS "studentId",
         TRIM(CONCAT_WS(' ', l.first_name, l.last_name)) AS "fullName",
         l.phone AS "phone",
         sa.status AS "status",
         sa.note AS "note"
  FROM student_classe sc
  JOIN student s ON s.id = sc.student_id AND s.is_active = true
  JOIN lead l ON l.id = s.lead_id AND l.is_active = true
  LEFT JOIN LATERAL (
    SELECT a.status, a.note
    FROM student_attendance a
    WHERE a.student_id = sc.student_id
      AND a.class_id = sc.class_id
      AND a."date" = $2::date
      AND a.is_active = true
    ORDER BY a.id DESC
    LIMIT 1
  ) sa ON true
  WHERE sc.is_active = true
    AND sc.class_id = $1
    AND sc.status = 'active'
  ORDER BY sc.id ASC
`;

class ClassAttendanceService {
  async getClassAttendance(classId: number, date: string) {
    const rows = (await AppDataSource.query(ROSTER_SQL, [classId, date])) as any[];

    const items = rows.map((r) => ({
      id: Number(r.id),
      studentId: Number(r.studentId),
      fullName: (r.fullName as string) ?? "",
      phone: (r.phone as string | null) ?? null,
      status: (r.status as "present" | "absent" | null) ?? null,
      note: (r.note as string | null) ?? null,
    }));

    return {
      classId,
      date,

      hasRecords: items.some((item) => item.status !== null),
      items,
    };
  }
}

export default new ClassAttendanceService();

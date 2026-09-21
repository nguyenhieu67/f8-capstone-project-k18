import { fetchApi } from "@/lib/api";
import type { ClassAttendanceI } from "@/types/classAttendance";

export async function getClassAttendance(classId: number, date: string) {
  return (await fetchApi.get("/class-attendance", {
    params: { classId, date },
  })) as ClassAttendanceI;
}

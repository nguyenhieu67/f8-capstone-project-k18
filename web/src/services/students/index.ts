import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";
import type {
  StudentAttendanceI,
  StudentClasseI,
  StudentI,
} from "@/types/database";
import type { PaginatedResultI } from "@/types/table";

// Student API
export async function getStudents() {
  return (await fetchApi.get("/students")) as PaginatedResultI<StudentI>;
}
export async function getStudentById(id: number) {
  return await fetchApi.get(`/students/${id}`);
}

export async function createStudent(payload: RequestBody) {
  return await fetchApi.post("/students", payload);
}

export async function updateStudent(id: number, payload: RequestBody) {
  return await fetchApi.put(`/students/${id}`, payload);
}

export async function deleteStudent(id: number) {
  return await fetchApi.delete(`/students/${id}`);
}

// Student classe API
export async function getStudentClasses(
  classId?: number,
  page?: number,
  limit?: number,
) {
  return (await fetchApi.get("/students/student-classes", {
    params: { classId, page, limit },
  })) as PaginatedResultI<StudentClasseI>;
}

// Student Attendance API
export async function getStudentAttendances() {
  return (await fetchApi.get(
    "/students/student-attendance",
  )) as PaginatedResultI<StudentAttendanceI>;
}

export async function saveStudentAttendance(payload: RequestBody[]) {
  return await fetchApi.post(
    "/students/student-attendance",
    payload as unknown as RequestBody,
  );
}

import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";

export async function getStudentClasses() {
  return await fetchApi.get("/students/student-classes");
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

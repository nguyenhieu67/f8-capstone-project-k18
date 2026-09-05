import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";

export async function getEmployees() {
  return await fetchApi.get("/employees");
}

export async function getEmployeeById(id: number) {
  return await fetchApi.get(`/employees/${id}`);
}

export async function createEmployee(payload: RequestBody) {
  return await fetchApi.post("/employees", payload);
}

export async function updateEmployee(id: number, payload: RequestBody) {
  return await fetchApi.put(`/employees/${id}`, payload);
}

export async function deleteEmployee(id: number) {
  return await fetchApi.delete(`/employees/${id}`);
}

// Staff Attendance
export async function getStaffAttendanceByDate(date: string) {
  return await fetchApi.get("/employees/staff-attendance", {
    params: { date },
  });
}

export async function saveStaffAttendance(payload: RequestBody[]) {
  return await fetchApi.post(
    "/employees/staff-attendance",
    payload as unknown as RequestBody,
  );
}

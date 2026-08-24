import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api.types";

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

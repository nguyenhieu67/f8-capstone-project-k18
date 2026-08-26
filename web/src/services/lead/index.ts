import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";

export async function getLeads() {
  return await fetchApi.get("/leads");
}

export async function getLeadById(id: number) {
  return await fetchApi.get(`/leads/${id}`);
}

export async function createLead(payload: RequestBody) {
  return await fetchApi.post("/leads", payload);
}

export async function updateLead(id: number, payload: RequestBody) {
  return await fetchApi.put(`/leads/${id}`, payload);
}

export async function deleteLead(id: number) {
  return await fetchApi.delete(`/leads/${id}`);
}

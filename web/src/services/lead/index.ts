import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";
import type { LeadI } from "@/types/database";
import type { PaginatedResultI } from "@/types/table";

export async function getLeads(page?: number, limit?: number) {
  return (await fetchApi.get("/leads", {
    params: { page, limit },
  })) as PaginatedResultI<LeadI>;
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

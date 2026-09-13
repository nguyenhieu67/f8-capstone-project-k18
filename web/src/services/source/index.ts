import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";
import type { SourceI } from "@/types/database";
import type { PaginatedResultI } from "@/types/table";

export async function getSources() {
  return (await fetchApi.get("/sources")) as PaginatedResultI<SourceI>;
}

export async function getSourceById(id: number) {
  return await fetchApi.get(`/sources/${id}`);
}

export async function createSource(payload: RequestBody) {
  return await fetchApi.post("/sources", payload);
}

export async function updateSource(id: number, payload: RequestBody) {
  return await fetchApi.put(`/sources/${id}`, payload);
}

export async function deleteSource(id: number) {
  return await fetchApi.delete(`/sources/${id}`);
}

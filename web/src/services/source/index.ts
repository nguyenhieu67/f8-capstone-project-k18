import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";

export async function getSources() {
  return await fetchApi.get("/sources");
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

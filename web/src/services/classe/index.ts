import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api";
import type { ClasseI } from "@/types/database";
import type { PaginatedResultI } from "@/types/table";

export async function getClasses() {
  return (await fetchApi.get("/classes")) as PaginatedResultI<ClasseI>;
}

export async function getClasseById(id: number) {
  return await fetchApi.get(`/classes/${id}`);
}

export async function createClasse(payload: RequestBody) {
  return await fetchApi.post("/classes", payload);
}

export async function updateClasse(id: number, payload: RequestBody) {
  return await fetchApi.put(`/classes/${id}`, payload);
}

export async function deleteClasse(id: number) {
  return await fetchApi.delete(`/classes/${id}`);
}

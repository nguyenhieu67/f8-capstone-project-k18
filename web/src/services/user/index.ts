import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api.types";

export async function getUserById(id: number) {
  return await fetchApi.get(`/users/${id}`);
}

export async function updateUser(id: number, payload: RequestBody) {
  return await fetchApi.put(`users/${id}`, payload);
}

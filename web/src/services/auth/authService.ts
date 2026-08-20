import { fetchApi } from "@/lib/api";
import type { RequestBody } from "@/types/api.types";

export async function register(payload: RequestBody) {
  return await fetchApi.post("/auth/register", payload);
}

export async function login(payload: RequestBody) {
  return await fetchApi.post("/auth/login", payload);
}

export async function getMe() {
  return await fetchApi.get("/auth/me");
}

export async function forgotPassword(payload: RequestBody) {
  return await fetchApi.post("/auth/forgot-password", payload);
}
export async function resetPassword(payload: RequestBody) {
  return await fetchApi.post("/auth/reset-password", payload);
}

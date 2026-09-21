import { fetchApi } from "@/lib/api";
import type { DashboardResultI } from "@/types/dashboard";

export async function getDashboard(month?: string) {
  return (await fetchApi.get("/dashboard", {
    params: { month },
  })) as DashboardResultI;
}

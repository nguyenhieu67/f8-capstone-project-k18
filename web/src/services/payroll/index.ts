import { fetchApi } from "@/lib/api";
import type { PayrollResultI } from "@/types/payroll";

export async function getPayroll(month: string) {
  return (await fetchApi.get("/payroll", {
    params: { month },
  })) as PayrollResultI;
}

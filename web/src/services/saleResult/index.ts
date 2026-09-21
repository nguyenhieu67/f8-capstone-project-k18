import { fetchApi } from "@/lib/api";
import type { SaleResultPageI } from "@/types/saleResult";

interface GetSaleResultsParams {
  page?: number;
  limit?: number;
  month?: string;
}

export async function getSaleResults(params: GetSaleResultsParams = {}) {
  return (await fetchApi.get("/sale-results", {
    params,
  })) as SaleResultPageI;
}

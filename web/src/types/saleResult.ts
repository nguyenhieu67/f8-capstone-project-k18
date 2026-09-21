import type { PaginatedResultI } from "./table";

export interface SaleResultRowI {
  id: number; // student_classe id
  enrolledAt: string;
  tuitionAmount: number;
  studentName: string;
  phone: string | null;
  purpose: string | null;
  who: string | null;
  sourceName: string | null;
  sellerName: string | null;
  className: string | null;
}

export interface SaleResultPageI extends PaginatedResultI<SaleResultRowI> {
  month: string | null;
  totalRevenue: number;
}

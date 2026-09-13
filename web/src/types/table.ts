interface ColumnI<T = RowI> {
  value: string;
  text: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface RowI {
  id?: number | string;
}

interface PaginatedResultI<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type { ColumnI, RowI, PaginatedResultI };

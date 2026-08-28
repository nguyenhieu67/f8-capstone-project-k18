interface ColumnI<T = RowI> {
  value: string;
  text: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface RowI {
  id?: number | string;
}

export type { ColumnI, RowI };

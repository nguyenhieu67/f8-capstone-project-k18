interface ColumnI {
  value: string;
  text: string;
}

interface RowI {
  id: number | string;
  [key: string]: string | number | undefined | object;
}

export type { ColumnI, RowI };

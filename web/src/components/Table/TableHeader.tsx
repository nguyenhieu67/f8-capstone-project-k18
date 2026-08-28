import type { ColumnI, RowI } from "@/types/table";
import { useTranslation } from "react-i18next";

interface TableHeaderProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
}

export default function TableHeader<T extends RowI = RowI>({
  columns,
}: TableHeaderProps<T>) {
  const { t } = useTranslation();
  return (
    <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-semibold text-slate-600 uppercase">
      <tr>
        {columns.map((column) => (
          <th key={column.value} className="p-4">
            {t(column.text)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

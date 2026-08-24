import type { ColumnI } from "@/types";
import { useTranslation } from "react-i18next";

interface TableHeaderProps {
  columns: ColumnI[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
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

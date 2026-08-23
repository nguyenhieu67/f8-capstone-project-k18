import type { ColumnI } from "@/types";

interface TableHeaderProps {
  columns: ColumnI[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-semibold text-slate-600 uppercase">
      <tr>
        {columns.map((column) => (
          <th key={column.value} className="p-4">
            {column.text}
          </th>
        ))}
      </tr>
    </thead>
  );
}

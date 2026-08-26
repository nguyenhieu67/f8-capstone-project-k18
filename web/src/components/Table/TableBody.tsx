import type { ColumnI, RowI } from "@/types/table";
import TableRow from "./TableRow";

interface TableBodyProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function TableBody<T extends RowI = RowI>({
  columns,
  rows,
  onEdit,
  onDelete,
}: TableBodyProps<T>) {
  return (
    <tbody className="divide-y divide-slate-100">
      {rows.map((row) => (
        <TableRow
          key={row.id}
          columns={columns}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
}

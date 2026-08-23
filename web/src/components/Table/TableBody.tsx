import type { ColumnI, RowI } from "@/types";
import TableRow from "./TableRow";

interface TableBodyProps {
  columns: ColumnI[];
  rows: RowI[];
  onEdit?: (row: RowI) => void;
  onDelete?: (row: RowI) => void;
}

export default function TableBody({
  columns,
  rows,
  onEdit,
  onDelete,
}: TableBodyProps) {
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

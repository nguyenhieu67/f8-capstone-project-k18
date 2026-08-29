import type { ColumnI, RowI } from "@/types/table";
import TableRow from "./TableRow";
import { useTranslation } from "react-i18next";

interface TableBodyProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
  rows: T[];
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function TableBody<T extends RowI = RowI>({
  columns,
  rows,
  emptyMessage = "Không có dữ liệu.",
  onEdit,
  onDelete,
}: TableBodyProps<T>) {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <tbody className="divide-y divide-slate-100">
        <tr>
          <td
            colSpan={columns.length}
            className="text-crm-label-text p-6 text-center text-sm"
          >
            {t(emptyMessage)}
          </td>
        </tr>
      </tbody>
    );
  }

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

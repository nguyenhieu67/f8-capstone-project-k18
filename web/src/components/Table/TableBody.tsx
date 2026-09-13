import type { ColumnI, RowI } from "@/types/table";
import TableRow from "./TableRow";
import { useTranslation } from "react-i18next";

interface TableBodyProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
  rows: T[];
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  limit?: number;
  total?: number;
}

export default function TableBody<T extends RowI = RowI>({
  columns,
  rows,
  emptyMessage = "Không có dữ liệu.",
  onEdit,
  onDelete,
  limit,
  total,
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

  const hasMultiplePages = !!limit && !!total && total > limit;
  const fillerCount =
    hasMultiplePages && rows.length < limit! ? limit! - rows.length : 0;

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
      {Array.from({ length: fillerCount }).map((_, index) => (
        <tr key={`filler-${index}`} aria-hidden="true">
          <td colSpan={columns.length} className="p-5">
            &nbsp;
          </td>
        </tr>
      ))}
    </tbody>
  );
}

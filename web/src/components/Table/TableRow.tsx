import type { ColumnI, RowI } from "@/types/table";
import { EditIcon, TrashIcon } from "../Icons";

interface TableRowProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
  row: T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function TableRow<T extends RowI = RowI>({
  columns,
  row,
  onEdit,
  onDelete,
}: TableRowProps<T>) {
  return (
    <tr className="text-crm-table-row-text transition hover:bg-slate-50">
      {columns.map((column) => {
        if (column.value === "actions") {
          return (
            <td key={column.value} className="p-3.5 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit?.(row)}
                  className="text-crm-label-text hover:text-crm-info cursor-pointer rounded p-1 transition hover:bg-slate-100"
                  title="Chỉnh sửa"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(row)}
                  className="text-crm-label-text hover:text-crm-danger cursor-pointer rounded p-1 transition hover:bg-slate-100"
                  title="Xóa"
                >
                  <TrashIcon />
                </button>
              </div>
            </td>
          );
        }
        return (
          <td key={column.value} className={`p-3.5 ${column.className ?? ""}`}>
            {column.render
              ? ((column.render(row) as React.ReactNode) ?? "")
              : ((row as Record<string, unknown>)[
                  column.value
                ] as React.ReactNode)}
          </td>
        );
      })}
    </tr>
  );
}

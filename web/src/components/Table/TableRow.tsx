import type { ColumnI, RowI } from "@/types";
import { EditIcon, TrashIcon } from "../Icons";

interface TableRowProps {
  columns: ColumnI[];
  row: RowI;
  onEdit?: (row: RowI) => void;
  onDelete?: (row: RowI) => void;
}

export default function TableRow({
  columns,
  row,
  onEdit,
  onDelete,
}: TableRowProps) {
  return (
    <tr className="transition hover:bg-slate-50">
      {columns.map((column) => {
        if (column.value === "actions") {
          return (
            <td key={column.value} className="p-4 whitespace-nowrap">
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
          <td key={column.value} className="p-4">
            {row[column.value] as React.ReactNode}
          </td>
        );
      })}
    </tr>
  );
}

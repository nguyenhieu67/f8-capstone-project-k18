import type { ColumnI, RowI } from "@/types/table";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

interface TableProps<T extends RowI = RowI> {
  columns: ColumnI<T>[];
  rows: T[];
  height?: string;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function Table<T extends RowI = RowI>({
  columns = [],
  rows = [],
  height = "h-125",
  emptyMessage,
  onEdit,
  onDelete,
}: TableProps<T>) {
  return (
    <div
      className={`max-w-[calc(100vw-362px)] scrollbar-thin overflow-x-auto overflow-y-auto ${height}`}
    >
      <table className="w-full border-collapse text-left text-sm">
        <TableHeader columns={columns} />
        <TableBody
          columns={columns}
          rows={rows}
          emptyMessage={emptyMessage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </div>
  );
}

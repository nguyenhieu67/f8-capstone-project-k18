import type { ColumnI, RowI } from "@/types";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

interface TableProps {
  columns: ColumnI[];
  rows: RowI[];
  height?: string;
  onEdit?: (row: RowI) => void;
  onDelete?: (row: RowI) => void;
}

export default function Table({
  columns,
  rows,
  height = "h-125",
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className={`scrollbar-thin overflow-x-auto overflow-y-auto ${height}`}>
      <table className="w-full border-collapse text-left text-sm">
        <TableHeader columns={columns} />
        <TableBody
          columns={columns}
          rows={rows}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </div>
  );
}

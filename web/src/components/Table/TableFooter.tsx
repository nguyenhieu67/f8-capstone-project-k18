import { useTranslation } from "react-i18next";
import { AnglesUpIcon, ChevronUpIcon } from "../Icons";

interface TableFooterProps {
  page: number;
  limit: number;
  total: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function TableFooter({
  page,
  limit,
  total,
  rowsPerPageOptions = [10, 25, 50],
  onPageChange,
  onLimitChange,
}: TableFooterProps) {
  const { t } = useTranslation();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="text-crm-label-text flex flex-wrap items-center justify-end gap-6 border-t border-slate-100 bg-slate-100 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span>{t("table.rowsPerPage", "Rows per page")}:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="cursor-pointer rounded border border-slate-200 bg-white px-2 py-1 text-sm outline-none"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <span>
        {start}-{end} {t("table.of", "of")} {total}
      </span>

      <div className="flex items-center gap-1">
        <div>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            title={t("table.firstPage", "Trang đầu")}
            className="cursor-pointer rounded p-1 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AnglesUpIcon size="sm" className="rotate-270" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            title={t("table.previousPage", "Trang trước")}
            className="cursor-pointer rounded p-1 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronUpIcon size="sm" className="rotate-270" />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            title={t("table.nextPage", "Trang sau")}
            className="cursor-pointer rounded p-1 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronUpIcon size="sm" className="rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            title={t("table.lastPage", "Trang cuối")}
            className="cursor-pointer rounded p-1 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AnglesUpIcon size="sm" className="rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

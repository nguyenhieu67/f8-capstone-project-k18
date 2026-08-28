import { useMemo } from "react";
import { CardBase } from "./CardBase";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/format";
import type { SourceStatus } from "@/types/database";
import { updateSource } from "@/services/source";

interface SourceCardProps {
  id?: number;
  icon?: React.ReactNode;
  title: string;
  status: SourceStatus;
  leadsCount?: number;
  convertedCount?: number;
  revenue?: string | number;
  iconBgClass?: string;
  onStatusChange?: (id: number, newStatus: SourceStatus) => void;
}

export function SourceCard({
  id,
  icon,
  title,
  status,
  leadsCount = 0,
  convertedCount = 0,
  revenue = 0,
  iconBgClass = "bg-blue-500",
  onStatusChange,
}: SourceCardProps) {
  const { t } = useTranslation();

  const sourceMetrics = useMemo(
    () => [
      {
        id: "leads",
        label: "sourcePage.stats.leadsCount",
        displayValue: `${leadsCount} ${t("sourcePage.stats.leadsUnit")}`,
        textColor: "text-crm-heading-text",
      },
      {
        id: "converted",
        label: "sourcePage.stats.convertedCount",
        displayValue: `${convertedCount} ${t("sourcePage.stats.convertedUnit")}`,
        textColor: "text-crm-success",
      },
      {
        id: "revenue",
        label: "sourcePage.stats.revenue",
        displayValue: formatCurrency(revenue, "VNĐ"),
        textColor: "text-crm-primary",
      },
    ],
    [convertedCount, leadsCount, revenue, t],
  );

  const nextStatus: SourceStatus = status === "active" ? "inactive" : "active";

  const handleChangeStatus = async () => {
    try {
      await updateSource(id as number, { status: nextStatus });
      onStatusChange?.(id as number, nextStatus);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CardBase className="flex flex-col gap-4">
      {/* Header Card */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: iconBgClass }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white shadow-sm"
          >
            {icon}
          </div>
          <h4 className="text-crm-heading-text text-base font-bold">{title}</h4>
        </div>
        <div className="group relative">
          <span
            className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium ${
              status === "active"
                ? "text-crm-success bg-emerald-100 hover:bg-emerald-200"
                : "text-crm-danger bg-red-100 hover:bg-red-200"
            }`}
            onClick={handleChangeStatus}
          >
            {t(`common.status.${status}`)}
          </span>

          {/* Tooltip */}
          <span className="pointer-events-none absolute top-full -right-6 z-10 mt-1.5 rounded-md bg-slate-800 px-2 py-1 text-[11px] whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100">
            {t("sourcePage.changeStatusTooltip", {
              status: t(`common.status.${nextStatus}`),
            })}
          </span>
        </div>
      </div>

      {/* Body Metrics */}
      <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
        {sourceMetrics.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-crm-label-text">{t(item.label)}: </span>
            <span className={`font-bold ${item.textColor}`}>
              {item.displayValue}
            </span>
          </div>
        ))}
      </div>
    </CardBase>
  );
}

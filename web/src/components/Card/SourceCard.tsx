import { useMemo } from "react";
import { CardBase } from "./CardBase";

interface SourceCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  leadsCount?: number;
  convertedCount?: number;
  revenue?: string | number;
  iconBgClass?: string;
}

export function SourceCard({
  icon,
  title,
  status,
  leadsCount = 0,
  convertedCount = 0,
  revenue = 0,
  iconBgClass = "bg-blue-500",
}: SourceCardProps) {
  const sourceMetrics = useMemo(
    () => [
      {
        id: "leads",
        label: "Số Leads mang về",
        displayValue: `${leadsCount} khách`,
        textColor: "text-crm-heading-text",
      },
      {
        id: "converted",
        label: "Đã chốt đơn",
        displayValue: `${convertedCount} học viên`,
        textColor: "text-crm-success",
      },
      {
        id: "revenue",
        label: "Doanh thu tạo ra",
        displayValue:
          typeof revenue === "number"
            ? `${revenue.toLocaleString("vi-VN")} VNĐ`
            : `${revenue} VNĐ`,
        textColor: "text-crm-primary",
      },
    ],
    [convertedCount, leadsCount, revenue],
  );

  return (
    <CardBase className="flex flex-col gap-4">
      {/* Header Card */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white shadow-sm ${iconBgClass}`}
          >
            {icon}
          </div>
          <h4 className="text-crm-heading-text text-base font-bold">{title}</h4>
        </div>
        <span className="text-crm-success rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium">
          {status}
        </span>
      </div>

      {/* Body Metrics */}
      <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
        {sourceMetrics.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-crm-label-text">{item.label}: </span>
            <span className={`font-bold ${item.textColor}`}>
              {item.displayValue}
            </span>
          </div>
        ))}
      </div>
    </CardBase>
  );
}

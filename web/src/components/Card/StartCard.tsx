import { CardBase } from "./CardBase";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  status?: "success" | "info" | "warning" | "primary";
}

// Map cố định màu sắc cho Tailwind quét được class name đầy đủ
const STATUS_STYLES = {
  success: {
    text: "text-emerald-600",
    bg: "bg-emerald-50 text-emerald-600",
  },
  info: {
    text: "text-blue-600",
    bg: "bg-blue-50 text-blue-600",
  },
  warning: {
    text: "text-amber-600",
    bg: "bg-amber-50 text-amber-600",
  },
  primary: {
    text: "text-indigo-600",
    bg: "bg-indigo-50 text-indigo-600",
  },
};

export function StatCard({
  title,
  value,
  subtext,
  icon,
  status = "success",
}: StatCardProps) {
  const currentStyle = STATUS_STYLES[status] || STATUS_STYLES.success;

  const formattedValue =
    typeof value === "number" && value >= 100000
      ? `${value.toLocaleString("vi-VN")} VNĐ`
      : value;

  return (
    <CardBase>
      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="space-y-1">
          <p className="text-crm-label-text text-xs font-bold tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-crm-heading-text text-2xl font-bold">
            {formattedValue}
          </h3>
          {subtext && (
            <p className={`text-xs font-medium ${currentStyle.text}`}>
              {subtext}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${currentStyle.bg}`}
        >
          {icon}
        </div>
      </div>
    </CardBase>
  );
}

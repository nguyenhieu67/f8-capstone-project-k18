import { useMemo } from "react";
import { CalenDarDaysIcon, ChalkboardUserIcon, TagIcon } from "../Icons";
import { CardBase } from "./CardBase";
import { formatCurrency, formatScheduleLanguage } from "@/utils/format";
import { useTranslation } from "react-i18next";
import type { ClassStatus } from "@/types/database";

interface ClassCardProps {
  code: string;
  name: string;
  status: ClassStatus;
  schedule: string;
  trainer: string;
  tuition: number;
  totalStudents?: string;
  className?: string;
  onClick?: () => void;
}
const STATUS_MAP: Record<
  ClassStatus,
  { label: string; bg: string; text: string }
> = {
  opening: {
    label: "classPage.status.opening",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  ongoing: {
    label: "classPage.status.ongoing",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  completed: {
    label: "classPage.status.completed",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  closed: {
    label: "classPage.status.closed",
    bg: "bg-slate-100",
    text: "text-slate-600",
  },
};

export function ClassCard({
  code,
  name,
  status,
  schedule,
  trainer,
  tuition,
  totalStudents,
  onClick,
}: ClassCardProps) {
  const { t } = useTranslation();

  const localizedSchedule = useMemo(
    () => formatScheduleLanguage(schedule, t),
    [schedule, t],
  );

  const classDetails = useMemo(
    () => [
      {
        id: "schedule",
        icon: <CalenDarDaysIcon />,
        label: "classPage.details.schedule",
        value: localizedSchedule,
      },
      {
        id: "trainer",
        icon: <ChalkboardUserIcon />,
        label: "classPage.details.trainer",
        value: trainer,
      },
      {
        id: "tuition",
        icon: <TagIcon />,
        label: "classPage.details.tuition",
        value: formatCurrency(tuition),
      },
    ],
    [localizedSchedule, trainer, tuition],
  );

  const currentStatus = STATUS_MAP[status] || STATUS_MAP.opening;

  return (
    <CardBase
      className="hover:border-crm-primary flex cursor-pointer flex-col justify-between gap-4"
      onClick={onClick}
    >
      <div className="mb-2">
        <div className="flex items-start justify-between gap-2 text-xs">
          <div>
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono font-bold text-indigo-700 uppercase">
              {code}
            </span>
            <h4 className="text-crm-heading-text mt-1 text-lg font-bold">
              {name}
            </h4>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}
          >
            {t(currentStatus.label)}
          </span>
        </div>

        <div className="text-crm-label-text mt-4 space-y-2.5 text-xs">
          {classDetails.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="shrink-0 text-slate-500">{item.icon}</span>
              <span className="text-slate-600">
                {t(item.label)}
                {": "}
                <strong className="font-medium text-slate-800">
                  {item.value}
                </strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs text-slate-500">
          {t("classPage.students.currentSize")}
        </span>
        <span className="text-sm font-bold text-indigo-600">
          {totalStudents} {t("classPage.students.unit")}
        </span>
      </div>
    </CardBase>
  );
}

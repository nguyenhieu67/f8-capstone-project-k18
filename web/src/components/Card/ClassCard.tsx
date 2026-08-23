import { useMemo } from "react";
import { CalenDarDaysIcon, ChalkboardUserIcon, TagIcon } from "../Icons";
import { CardBase } from "./CardBase";

interface ClassCardProps {
  code: string;
  name: string;
  status: string;
  schedule: string;
  trainer: string;
  fee: string;
  totalStudents: string;
}

export function ClassCard({
  code,
  name,
  status,
  schedule,
  trainer,
  fee,
  totalStudents,
}: ClassCardProps) {
  // Đưa mảng vào trong để nhận giá trị từ Props
  const classDetails = useMemo(
    () => [
      {
        id: "schedule",
        icon: <CalenDarDaysIcon />,
        label: "Lịch:",
        value: schedule,
      },
      {
        id: "trainer",
        icon: <ChalkboardUserIcon />,
        label: "Giảng viên:",
        value: trainer,
      },
      {
        id: "fee",
        icon: <TagIcon />,
        label: "Học phí:",
        value: fee,
      },
    ],
    [fee, schedule, trainer],
  );

  return (
    <CardBase className="flex flex-col justify-between gap-4">
      <div>
        {/* Header: Mã lớp, Tên lớp & Trạng thái */}
        <div className="flex items-start justify-between gap-2 text-xs">
          <div>
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono font-bold text-indigo-700 uppercase">
              {code}
            </span>
            <h4 className="text-crm-heading-text mt-1 text-lg font-bold">
              {name}
            </h4>
          </div>
          <span className="text-crm-success shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 font-semibold">
            {status}
          </span>
        </div>

        {/* Body: Danh sách chi tiết */}
        <div className="text-crm-label-text mt-4 space-y-2.5 text-xs">
          {classDetails.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="shrink-0 text-slate-500">{item.icon}</span>
              <span className="text-slate-600">
                {item.label}{" "}
                <strong className="font-medium text-slate-800">
                  {item.value}
                </strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Sĩ số */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Sĩ số hiện tại:</span>
        <span className="text-sm font-bold text-indigo-600">
          {totalStudents} học viên
        </span>
      </div>
    </CardBase>
  );
}

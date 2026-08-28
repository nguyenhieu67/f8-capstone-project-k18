import { useState, useEffect } from "react";
import { ChevronUpIcon } from "../Icons";
import { FormGroup } from "./FormGroup";
import { useClickOutside } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SCHEDULE_DAYS } from "@/constants/schedule";

interface ScheduleSelectorProps {
  value: string;
  label?: string;
  id?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function ScheduleSelector({
  value,
  label = "classPage.scheduleModal.title",
  id,
  error,
  onChange,
}: ScheduleSelectorProps) {
  const { t } = useTranslation();
  const { isOpen, setIsOpen, ref } = useClickOutside<HTMLDivElement>();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("18:30");
  const [endTime, setEndTime] = useState("21:00");

  useEffect(() => {
    if (value) {
      const match = value.match(/(.*?)\s*\((.*?)\)/);
      if (match) {
        const daysPart = match[1].split("-").map((d) => d.trim());
        const timePart = match[2].split("-").map((t) => t.trim());

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedDays(daysPart);
        if (timePart[0]) setStartTime(timePart[0]);
        if (timePart[1]) setEndTime(timePart[1]);
      }
    }
  }, [value]);

  const toggleDay = (dayId: string) => {
    const updated = selectedDays.includes(dayId)
      ? selectedDays.filter((d) => d !== dayId)
      : [...selectedDays, dayId];

    const sorted = SCHEDULE_DAYS.map((d) => d.id).filter((d) =>
      updated.includes(d),
    );
    setSelectedDays(sorted);
    updateScheduleString(sorted, startTime, endTime);
  };

  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    updateScheduleString(selectedDays, start, end);
  };

  const updateScheduleString = (days: string[], start: string, end: string) => {
    if (days.length === 0) {
      onChange("");
      return;
    }
    const daysStr = days.join(" - ");
    const timeStr = `(${start} - ${end})`;
    onChange(`${daysStr} ${timeStr}`);
  };

  return (
    <FormGroup label={label} htmlFor={id} error={error}>
      <div ref={ref} className="relative w-full">
        {/* Input / Button trigger */}
        <button
          type="button"
          id={id}
          className={`border-crm-border bg-crm-surface text-crm-heading-text focus:ring-crm-primary/30 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-normal focus:ring-2 focus:outline-none ${
            error ? "border-red-500" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? "text-crm-heading-text" : "text-gray-400"}>
            {t("classPage.scheduleModal.selectDayAndTime")}
          </span>
          <ChevronUpIcon
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {/* Popover chọn Thứ & Giờ */}
        {isOpen && (
          <div className="border-crm-border bg-crm-surface absolute top-full left-0 z-50 mt-1 w-full rounded-2xl border p-4 shadow-xl">
            {/* Chọn các Thứ */}
            <div className="mb-4">
              <span className="text-crm-label-text mb-2 block text-xs font-medium">
                {t("classPage.scheduleModal.selectDaysHeader")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SCHEDULE_DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-crm-primary text-white"
                          : "border-crm-border bg-crm-bg-hover text-crm-heading-text border"
                      }`}
                    >
                      {t(day.label)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select start time & end time */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-crm-label-text mb-1 block text-xs font-medium">
                  {t("classPage.scheduleModal.fromTime")}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange(e.target.value, endTime)}
                  className="border-crm-border bg-crm-surface text-crm-heading-text w-full rounded-lg border px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-crm-label-text mb-1 block text-xs font-medium">
                  {t("classPage.scheduleModal.toTime")}:
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange(startTime, e.target.value)}
                  className="border-crm-border bg-crm-surface text-crm-heading-text w-full rounded-lg border px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Confirm */}
            <button
              type="button"
              className="bg-crm-primary w-full rounded-lg py-1.5 text-xs font-medium text-white hover:opacity-90"
              onClick={() => setIsOpen(false)}
            >
              {t("classPage.scheduleModal.confirm")}
            </button>
          </div>
        )}
      </div>
    </FormGroup>
  );
}

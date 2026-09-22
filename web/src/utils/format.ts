import { SCHEDULE_DAYS } from "@/constants/schedule";

// Momney
export const formatCurrency = (
  value: string | number,
  unit: string = "VNĐ",
) => {
  const num = Number(value);
  if (isNaN(num)) return `0 ${unit}`;

  return `${num.toLocaleString("en-US")} ${unit}`;
};
// Date from user using
export const toLocalDateString = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Format schedule
const DAYS_KEY_MAP: Record<string, string> = SCHEDULE_DAYS.reduce(
  (acc, day) => ({ ...acc, [day.id]: day.label }),
  {},
);

export const formatScheduleLanguage = (
  schedule: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any,
): string => {
  if (!schedule) return "";

  return schedule.replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, (matched) => {
    const translationKey = DAYS_KEY_MAP[matched];
    return translationKey ? t(translationKey) : matched;
  });
};

export const formatMonthShort = (month: string) => {
  const [year, m] = month.split("-");
  return `${m}/${year.slice(2)}`;
};

export const formatCompactNumber = (value: number, language: string) =>
  new Intl.NumberFormat(language, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

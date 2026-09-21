import AppError from "./AppError";

const TIMEZONE = "Asia/Ho_Chi_Minh";
const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const pad = (n: number) => String(n).padStart(2, "0");

export function getCurrentMonth(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

export function resolveMonth(queryMonth: unknown): string {
  const month = typeof queryMonth === "string" && queryMonth ? queryMonth : getCurrentMonth();

  if (!MONTH_REGEX.test(month)) {
    throw AppError.badRequest("Tham số month phải có dạng YYYY-MM (VD: 2026-09).");
  }
  return month;
}

export function resolveOptionalMonth(queryMonth: unknown): string | undefined {
  if (typeof queryMonth !== "string" || !queryMonth) return undefined;
  return resolveMonth(queryMonth);
}

export function getPreviousMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return m === 1 ? `${year - 1}-12` : `${year}-${pad(m - 1)}`;
}

export function getMonthRange(month: string) {
  const [year, m] = month.split("-").map(Number);
  const nextYear = m === 12 ? year + 1 : year;
  const nextMonth = m === 12 ? 1 : m + 1;

  const startDate = `${year}-${pad(m)}-01`;
  const endDate = `${nextYear}-${pad(nextMonth)}-01`;

  return {
    startDate,
    endDate,
    start: new Date(`${startDate}T00:00:00+07:00`),
    end: new Date(`${endDate}T00:00:00+07:00`),
  };
}

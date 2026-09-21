const VN_LOWER = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";

const removeDiacritics = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const VN_FROM = VN_LOWER + VN_LOWER.toUpperCase();
export const VN_TO = Array.from(VN_FROM, removeDiacritics).join("");

export function normalizeSearchText(value: unknown): string {
  if (typeof value !== "string") return "";
  return removeDiacritics(value).toLowerCase().replace(/\s+/g, " ").trim();
}

export const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const isPhoneLike = (keyword: string) => /^[\d\s.+-]+$/.test(keyword);

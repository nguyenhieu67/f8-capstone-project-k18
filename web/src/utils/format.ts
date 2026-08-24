export const formatCurrency = (
  value: string | number,
  unit: string = "VNĐ",
) => {
  const num = Number(value);
  if (isNaN(num)) return `0 ${unit}`;

  return `${num.toLocaleString("en-US")} ${unit}`;
};

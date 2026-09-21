const buildSelectOptions = <T extends { id?: number | string }>(
  items: T[],
  getLabel: (item: T) => string,
  placeholderLabel: string,
) => [
  { label: placeholderLabel, value: "" },
  ...items.map((item) => ({
    label: getLabel(item),
    value: String(item.id ?? ""),
  })),
];

export { buildSelectOptions };

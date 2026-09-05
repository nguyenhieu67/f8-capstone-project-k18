import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  label: string;
  color?: string;
  colors?: string;
}

export default function StatusBadge({
  label,
  color,
  colors,
}: StatusBadgeProps) {
  const { t } = useTranslation();

  if (colors) {
    return (
      <span
        className="rounded-full px-2.5 py-1 font-semibold"
        style={{
          color: colors,
          backgroundColor: `color-mix(in srgb, ${colors} 15%, transparent)`,
        }}
      >
        {t(label)}
      </span>
    );
  }

  if (!color) {
    return <span>{t(label)}</span>;
  }

  return (
    <span
      className="rounded-full px-2.5 py-1 font-semibold"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
      }}
    >
      {t(label)}
    </span>
  );
}

import { useTranslation } from "react-i18next";

interface CardBaseProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CardBase({
  children,
  className = "",
  title,
  icon,
}: CardBaseProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      {title && (
        <div className="text-crm-heading-text mb-4 flex items-center gap-2 text-2xl font-bold">
          {icon && <span>{icon}</span>}
          <span>{t(title)}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

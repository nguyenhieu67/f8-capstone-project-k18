import { useTranslation } from "react-i18next";

interface CardBaseProps {
  children: React.ReactNode;
  title?: string;
  desc?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CardBase({
  children,
  className = "",
  title,
  desc,
  icon,
}: CardBaseProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      {title && (
        <div>
          <div className="text-crm-heading-text flex items-center gap-2 text-2xl font-bold">
            {icon && <span>{icon}</span>}
            <h4>{t(title)}</h4>
          </div>
          {desc && (
            <p className="text-crm-label-text mt-1 text-sm">{t(desc)}</p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...props
}: CardBaseProps) {
  const { t } = useTranslation();
  return (
    <div
      {...props}
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      {title && (
        <div className="w-10/12">
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

import { LanguageSelect } from "@/components/Form";
import { RotateRightIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
  showLiveStatus?: boolean;
  liveStatusLabel?: string;
  onRefresh?: () => void;
  refreshTooltip?: string;
}

export default function Header({
  title,
  showLiveStatus = true,
  liveStatusLabel = "dashboardPage.header.liveStatus",
  onRefresh,
  refreshTooltip = "Khôi phục dữ liệu mẫu",
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language
    ? i18n.language.split("-")[0]
    : user?.langCode;

  return (
    <header className="no-print relative z-1 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-crm-header-text text-xl font-bold">{title}</h2>

        {showLiveStatus && (
          <span className="flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t(liveStatusLabel)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title={refreshTooltip}
            className="bg-crm-header-button-bg text-crm-header-button-text hover:bg-crm-header-button-bg-hover rounded-lg p-2 transition"
          >
            <RotateRightIcon size="sm" />
          </button>
        )}

        <div>
          <LanguageSelect
            showIcon={false}
            showLable={false}
            value={currentLang}
            onChange={(code) => i18n.changeLanguage(code)}
          />
        </div>
      </div>
    </header>
  );
}

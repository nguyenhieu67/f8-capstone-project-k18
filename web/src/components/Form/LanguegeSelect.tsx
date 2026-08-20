import { ChevronUpIcon, GlobeIcon } from "@/components/Icons";
import { useClickOutside } from "@/hooks";

export interface LanguageOption {
  code: string;
  label: string;
  flag?: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export interface LanguageSelectProps {
  value?: string;
  onChange?: (code: string) => void;
  languages?: LanguageOption[];
  showIcon?: boolean;
  className?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value = "vi",
  onChange,
  languages = DEFAULT_LANGUAGES,
  showIcon = true,
  className = "",
}) => {
  const { isOpen, setIsOpen, ref } = useClickOutside<HTMLDivElement>();

  const selectedLang =
    languages.find((lang) => lang.code === value) || languages[0];

  const handleSelect = (code: string) => {
    onChange?.(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      className={`relative inline-block w-full text-left sm:w-auto ${className}`}
    >
      {/* Open Menu */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-crm-surface text-crm-heading-text border-crm-border focus:border-crm-primary focus:ring-crm-primary flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm transition-colors focus:ring-1 focus:outline-none"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {showIcon && (
            <span className="text-crm-label-text shrink-0">
              <GlobeIcon size="md" />
            </span>
          )}
          <span className="truncate">
            {selectedLang.flag && `${selectedLang.flag} `}
            {selectedLang.label}
          </span>
        </div>

        <ChevronUpIcon
          size={"xs"}
          className={`${isOpen ? "" : "rotate-180"} transition-transform duration-200`}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="bg-crm-surface border-crm-border shadow-crm-boxshadow absolute right-0 z-50 mt-1.5 w-full min-w-35 rounded-xl border py-1 shadow-lg transition-all">
          <ul className="max-h-60 overflow-auto text-sm">
            {languages.map((lang) => {
              const isSelected = lang.code === selectedLang.code;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`hover:bg-crm-menu-item-bg-hover flex w-full items-center justify-between px-3.5 py-2 text-left transition-colors ${
                      isSelected
                        ? "text-crm-primary font-semibold"
                        : "text-crm-heading-text"
                    }`}
                  >
                    <span>
                      {lang.flag && `${lang.flag} `}
                      {lang.label}
                    </span>

                    {isSelected && (
                      <svg
                        className="text-crm-primary h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

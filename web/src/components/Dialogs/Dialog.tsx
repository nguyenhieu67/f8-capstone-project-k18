import { useEffect } from "react";
import { CloseIcon } from "../Icons";
import { useTranslation } from "react-i18next";

const DIALOG_SIZE_MAP = {
  sm: "24rem",
  md: "32rem",
  lg: "48rem",
  xl: "64rem",
  full: "calc(100vw - 2rem)",
};

type WidthSize = keyof typeof DIALOG_SIZE_MAP | number;

interface DialogProps {
  isOpen: boolean;
  loading: boolean;
  title?: string;
  icon?: React.ReactNode;
  widthSize?: WidthSize;
  buttonAction?: string;
  buttonColor?: string;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onReset?: () => void;
  onDelete?: () => void;
}

export default function Dialog({
  isOpen,
  loading,
  title,
  icon,
  widthSize = "md",
  buttonAction,
  buttonColor,
  children,
  className = "",
  onClose,
  onSubmit,
  onReset,
  onDelete,
}: DialogProps) {
  const { t } = useTranslation();
  const pixelSize =
    typeof widthSize === "number"
      ? widthSize
      : (DIALOG_SIZE_MAP[widthSize] ?? DIALOG_SIZE_MAP.md);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div
        style={{ width: pixelSize }}
        className={`relative z-10 rounded-lg bg-white p-6 shadow-xl transition-all ${className}`}
      >
        <div className="absolute top-0 left-0 flex w-full items-center justify-between rounded-t-lg bg-linear-to-r from-indigo-600 to-violet-600 p-5 text-white">
          {title && (
            <>
              {icon && <span>{icon}</span>}
              <h3 className="ml-1 text-lg font-semibold">{t(title)}</h3>
            </>
          )}
          <button
            onClick={onClose}
            className="ml-auto cursor-pointer hover:text-white/80 focus:outline-none"
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-20">{children}</div>

        {/* Action Buttons */}
        <div className="border-crm-border flex border-t pt-5">
          {onDelete && (
            <button
              type="button"
              disabled={loading}
              className="bg-crm-danger cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onDelete}
            >
              {t("common.button.delete")}
            </button>
          )}
          <div className="ml-auto flex">
            <button
              className="border-crm-border bg-crm-surface text-crm-heading-text hover:bg-crm-menu-item-bg-hover rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
              onClick={onClose}
            >
              {t("common.button.cancel")}
            </button>
            <button
              disabled={loading}
              className={`ml-3 rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${buttonColor ? buttonColor : "bg-crm-primary"}`}
              onClick={() => {
                onSubmit();
                if (onReset) onReset();
              }}
            >
              {loading ? t("common.button.saving") : t(buttonAction || "Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

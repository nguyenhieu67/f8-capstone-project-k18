import { useEffect } from "react";
import { CloseIcon } from "../Icons";
import { useTranslation } from "react-i18next";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  icon,
  children,
  className = "",
}: DialogProps) {
  const { t } = useTranslation();

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
        className={`relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl transition-all ${className}`}
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
      </div>
    </div>
  );
}

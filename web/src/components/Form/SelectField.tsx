import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormGroup, SIZE_STYLES } from "./FormGroup";
import { ChevronUpIcon } from "../Icons";
import { useClickOutside } from "@/hooks";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label: string;
  id?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  error?: string;
  required?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  options,
  value,
  onChange,
  error,
  size = "md",
  className = "",
}) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen, ref } = useClickOutside();
  const [openUpward, setOpenUpward] = useState<boolean>(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 200;

      if (spaceBelow < dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen, ref]);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: optionValue,
        },
      });
    }
    setIsOpen(false);
  };

  return (
    <FormGroup label={label} htmlFor={id} error={error}>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative w-full"
      >
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-crm-surface text-crm-heading-text border-crm-border focus:border-crm-primary focus:ring-crm-primary flex w-full items-center justify-between rounded-xl border px-3 transition-all focus:ring-1 focus:outline-none ${SIZE_STYLES[size]} ${className}`}
        >
          <span className="truncate">
            {selectedOption ? t(selectedOption.label) : ""}
          </span>
          <ChevronUpIcon
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`bg-crm-surface border-crm-border absolute left-0 z-50 max-h-60 w-full overflow-y-auto rounded-xl border py-1 shadow-lg ${
              openUpward ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]"
            }`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  ref={isSelected ? selectedItemRef : null}
                  onClick={() => handleSelect(opt.value)}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-crm-primary/10 text-crm-primary font-medium"
                      : "text-crm-heading-text hover:bg-crm-menu-item-bg-hover"
                  }`}
                >
                  {t(opt.label)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FormGroup>
  );
};

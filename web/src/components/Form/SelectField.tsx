import { useTranslation } from "react-i18next";
import { FormGroup } from "./FormGroup";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  options,
  error,
  className = "",
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <FormGroup label={label} htmlFor={id} error={error}>
      <div className="relative">
        <select
          id={id}
          className={`bg-crm-surface text-crm-heading-text border-crm-border focus:border-crm-primary focus:ring-crm-primary block w-full rounded-xl border px-3 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-crm-surface text-crm-heading-text"
            >
              {t(opt.label)}
            </option>
          ))}
        </select>
      </div>
    </FormGroup>
  );
};

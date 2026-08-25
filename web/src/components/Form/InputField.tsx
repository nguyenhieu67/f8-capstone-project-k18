import { useTranslation } from "react-i18next";
import { FormGroup } from "./FormGroup";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  id,
  placeholder,
  error,
  className = "",
  ...props
}) => {
  const { t } = useTranslation();
  const borderStyles = error
    ? "border-crm-danger focus:border-crm-danger focus:ring-crm-danger"
    : "border-crm-border focus:border-crm-primary focus:ring-crm-primary";

  return (
    <FormGroup label={label} htmlFor={id} error={error}>
      <div className="relative">
        {icon && (
          <div className="text-crm-label-text pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          id={id}
          placeholder={t(placeholder || "")}
          className={`block w-full ${
            icon ? "pl-10" : "px-3"
          } bg-crm-surface text-crm-heading-text placeholder:text-crm-label-text/60 rounded-xl border py-2.5 pr-3 text-sm transition-colors focus:ring-1 focus:outline-none ${borderStyles} ${className}`}
          {...props}
        />
      </div>
    </FormGroup>
  );
};

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
  error,
  className = "",
  ...props
}) => {
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
          className={`block w-full ${
            icon ? "pl-10" : "px-3"
          } bg-crm-surface text-crm-heading-text border-crm-border placeholder:text-crm-label-text/60 focus:border-crm-primary focus:ring-crm-primary rounded-xl border py-2.5 pr-3 text-sm transition-colors focus:ring-1 focus:outline-none ${className}`}
          {...props}
        />
      </div>
    </FormGroup>
  );
};

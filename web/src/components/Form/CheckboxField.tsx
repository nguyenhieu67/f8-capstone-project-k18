export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={`text-crm-primary focus:ring-crm-primary border-crm-border bg-crm-surface h-4 w-4 cursor-pointer rounded ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className="text-crm-label-text ml-2 block cursor-pointer text-sm"
      >
        {children}
      </label>
    </div>
  );
};

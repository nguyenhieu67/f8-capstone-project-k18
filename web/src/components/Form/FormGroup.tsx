import React from "react";

export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-crm-label-text mb-1 block text-sm font-semibold"
        >
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-crm-danger mt-1 text-xs">{error}</p>}
    </div>
  );
};

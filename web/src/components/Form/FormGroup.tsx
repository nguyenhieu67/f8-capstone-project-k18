import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-crm-label-text mb-1 block text-sm font-semibold"
        >
          {t(label)}
        </label>
      )}
      {children}
      {error && <p className="text-crm-danger mt-1 text-xs">{error}</p>}
    </div>
  );
};

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  UserIcon,
  PhoneIcon,
  EmailIcon,
  LockIcon,
  ShieldHalvedIcon,
} from "@/components/Icons";
import {
  CheckboxField,
  InputField,
  SelectField,
  type SelectOption,
} from "@/components/Form";
import { registerSchema, validationForm, type FormErrors } from "@/utils";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { register } from "@/services/auth";
import Button from "@/components/Button";
import { Logo } from "@/components/ui";
import { type RegisterFormI } from "@/types/auth";
import { useForm } from "@/hooks";

const DEFAULT_FORM: RegisterFormI = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  confirmPassword: "",
};

export default function Register() {
  const { t } = useTranslation();
  const { formData, setFormData, handleChange } = useForm(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const ROLE_OPTIONS: SelectOption[] = useMemo(
    () => [
      { label: t("authPage.register.roles.admin"), value: "admin" },
      { label: t("authPage.register.roles.authorized"), value: "authorized" },
    ],
    [t],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validationForm(registerSchema, formData, setErrors)) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _confirmPassword, ...payload } = formData;

      await register(payload);

      setFormData(DEFAULT_FORM);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Mobile */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo isLogin={false} variant="light" />
        </div>
        <h2 className="text-crm-heading-text mt-6 text-center text-2xl font-bold tracking-tight">
          {t("authPage.register.title")}
        </h2>
        <p className="text-crm-label-text mt-2 text-center text-sm">
          {t("authPage.register.or")}
          <Button
            to={ROUTE_PATHS.LOGIN}
            text
            buttonTitle="authPage.register.hasAccount"
          />
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-crm-surface border-crm-border border px-4 py-8 shadow-sm sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Full name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField
                id="firstName"
                name="firstName"
                label={t("authPage.register.firstName")}
                placeholder={t("authPage.register.firstNamePlaceholder")}
                icon={<UserIcon />}
                value={formData.firstName}
                error={errors.firstName ? t(errors.firstName) : ""}
                onChange={handleChange}
                required
              />
              <InputField
                id="lastName"
                name="lastName"
                label={t("authPage.register.lastName")}
                placeholder={t("authPage.register.lastNamePlaceholder")}
                icon={<UserIcon />}
                value={formData.lastName}
                error={errors.lastName ? t(errors.lastName) : ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <InputField
              id="phone"
              name="phone"
              type="tel"
              label={t("authPage.register.phone")}
              placeholder="0987*******"
              icon={<PhoneIcon />}
              value={formData.phone}
              error={errors.phone ? t(errors.phone) : ""}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <InputField
              id="email"
              name="email"
              type="email"
              label={t("authPage.register.email")}
              placeholder="email@domain.com"
              icon={<EmailIcon />}
              autoComplete="email"
              value={formData.email}
              error={errors.email ? t(errors.email) : ""}
              onChange={handleChange}
              required
            />

            {/* Role */}
            <SelectField
              id="role"
              name="role"
              label={t("authPage.register.role")}
              options={ROLE_OPTIONS}
              value={formData.role}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField
                id="password"
                name="password"
                type="password"
                label={t("authPage.register.password")}
                placeholder="••••••••"
                icon={<LockIcon />}
                autoComplete="new-password"
                value={formData.password}
                error={errors.password ? t(errors.password) : ""}
                onChange={handleChange}
                required
              />
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label={t("authPage.register.confirmPassword")}
                placeholder="••••••••"
                icon={<ShieldHalvedIcon />}
                autoComplete="new-password"
                value={formData.confirmPassword}
                error={errors.confirmPassword ? t(errors.confirmPassword) : ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Terms */}
            <CheckboxField id="terms" name="terms" required>
              {t("authPage.register.agreePrefix")}
              <Button href="#" text buttonTitle="authPage.register.terms" />
              {t("authPage.register.and")}
              <Button href="#" text buttonTitle="authPage.register.terms" />
            </CheckboxField>

            {/* Submit Button */}
            <div>
              <Button
                primary
                widthFull
                buttonTitle="authPage.register.submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

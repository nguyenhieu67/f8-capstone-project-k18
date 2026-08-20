import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { EmailIcon, LockIcon } from "@/components/Icons";
import { CheckboxField, InputField, LanguageSelect } from "@/components/Form";
import { Logo } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { loginSchema, validationForm, type FormErrors } from "@/utils";
import { login } from "@/services/auth";
import Button from "@/components/Button";

export default function Login() {
  const form = {
    email: "",
    password: "",
  };

  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState(form);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const currentLang = i18n.language ? i18n.language.split("-")[0] : "vi";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validationForm(loginSchema, formData, setErrors)) return;

    try {
      const payload = { ...formData };
      await login(payload);
      setFormData(form);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelect
          value={currentLang}
          onChange={(code) => i18n.changeLanguage(code)}
        />
      </div>

      <div className="w-full max-w-lg space-y-8">
        {/* Logo Mobile */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo variant="light" />
        </div>

        <div>
          <h2 className="text-crm-heading-text text-center text-2xl font-bold lg:text-left">
            {t("login.title")}
          </h2>
          <p className="text-crm-label-text mt-2 text-center text-sm lg:text-left">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Form Card */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Email */}
            <InputField
              id="email"
              name="email"
              type="email"
              label={t("login.email")}
              placeholder="admin@center.edu"
              icon={<EmailIcon size="md" />}
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email ? t(errors.email) : ""}
              required
            />
            {/* Password */}
            <InputField
              id="password"
              name="password"
              type="password"
              label={t("login.password")}
              placeholder="••••••••"
              icon={<LockIcon size="md" />}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password ? t(errors.password) : ""}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <CheckboxField id="remember-me" name="remember-me">
              {t("login.remember")}
            </CheckboxField>

            {/* Forgot password Button */}
            <div className="text-sm">
              <Button
                to={ROUTE_PATHS.FORGOT_PASSWORD}
                className="text-crm-primary font-semibold transition-opacity hover:opacity-80"
              >
                {t("login.forgot_password")}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button widthFull primary>
            {t("login.submit")}
          </Button>
        </form>

        {/* Register Button */}
        <p className="text-crm-label-text text-center text-sm">
          {t("login.no_account")}
          <Button
            to={ROUTE_PATHS.REGISTER}
            className="text-crm-primary font-semibold transition-opacity hover:opacity-80"
          >
            {t("login.register_now")}
          </Button>
        </p>
      </div>
    </>
  );
}

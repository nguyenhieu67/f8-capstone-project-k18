import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { EmailIcon, LockIcon } from "@/components/Icons";
import { CheckboxField, InputField } from "@/components/Form";
import { LoadingSpinner, Logo } from "@/components/ui";
import Button from "@/components/Button";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { login } from "@/services/auth";
import type { LoginFormI } from "@/types/auth.types";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, validationForm, type FormErrors } from "@/utils";

export default function Login() {
  const form: LoginFormI = {
    email: "",
    password: "",
  };

  const { t } = useTranslation();

  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState(form);
  const [errors, setErrors] = useState<FormErrors>({});
  const [checking, setChecking] = useState<boolean>(true);
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const isValid = await handleCheckAuth();
      if (isValid) {
        navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
      } else {
        setChecking(false);
      }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) return <LoadingSpinner />;

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
      await refetchUser();
      setFormData(form);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error(error);
      setErrors({
        email: "",
        password: t("authPage.validation.password.incorrect"),
      });
    }
  };

  return (
    <>
      <div className="w-full max-w-lg space-y-8">
        {/* Logo Mobile */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo isLogin={false} variant="light" />
        </div>

        <div>
          <h2 className="text-crm-heading-text text-center text-2xl font-bold lg:text-left">
            {t("authPage.login.title")}
          </h2>
          <p className="text-crm-label-text mt-2 text-center text-sm lg:text-left">
            {t("authPage.login.subtitle")}
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
              label={t("authPage.login.email")}
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
              label={t("authPage.login.password")}
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
              {t("authPage.login.remember")}
            </CheckboxField>

            {/* Forgot password Button */}
            <div className="text-sm">
              <Button
                to={ROUTE_PATHS.FORGOT_PASSWORD}
                buttonTitle="authPage.login.forgotPassword"
                className="text-crm-primary font-semibold transition-opacity hover:opacity-80"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button widthFull primary buttonTitle="authPage.login.submit" />
        </form>

        {/* Register Button */}
        <p className="text-crm-label-text text-center text-sm">
          {t("authPage.login.noAccount")}
          <Button
            to={ROUTE_PATHS.REGISTER}
            buttonTitle="authPage.login.registerNow"
            className="text-crm-primary font-semibold transition-opacity hover:opacity-80"
          />
        </p>
      </div>
    </>
  );
}

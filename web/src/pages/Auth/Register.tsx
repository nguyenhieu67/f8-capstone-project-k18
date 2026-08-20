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
  LanguageSelect,
  SelectField,
  type SelectOption,
} from "@/components/Form";
import { registerSchema, validationForm, type FormErrors } from "@/utils";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { register } from "@/services/auth";
import Button from "@/components/Button";
import { Logo } from "@/components/ui";

export default function Register() {
  const form = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: "",
  };

  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState(form);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const currentLang = i18n.language ? i18n.language.split("-")[0] : "vi";

  const ROLE_OPTIONS: SelectOption[] = useMemo(
    () => [
      { label: t("register.roles.admin"), value: "admin" },
      { label: t("register.roles.authorized"), value: "authorized" },
    ],
    [t],
  );

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

    if (!validationForm(registerSchema, formData, setErrors)) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _confirmPassword, ...payload } = formData;

      await register(payload);

      setFormData(form);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="absolute top-4 right-4">
        <LanguageSelect
          value={currentLang}
          onChange={(code) => i18n.changeLanguage(code)}
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Mobile */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo variant="light" />
        </div>
        <h2 className="text-crm-heading-text mt-6 text-center text-2xl font-bold tracking-tight">
          {t("register.title")}
        </h2>
        <p className="text-crm-label-text mt-2 text-center text-sm">
          {t("register.or")}
          <Button to={ROUTE_PATHS.LOGIN} text>
            {t("register.has_account")}
          </Button>
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
                label={t("register.firstName")}
                placeholder={t("register.firstName")}
                icon={<UserIcon />}
                value={formData.firstName}
                error={errors.firstName ? t(errors.firstName) : ""}
                onChange={handleChange}
                required
              />
              <InputField
                id="lastName"
                name="lastName"
                label={t("register.lastName")}
                placeholder={t("register.lastName")}
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
              label={t("register.phone")}
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
              label={t("register.email")}
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
              label={t("register.role")}
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
                label={t("register.password")}
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
                label={t("register.confirm_password")}
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
              {t("register.agree_prefix")}
              <Button href="#" text>
                {t("register.terms")}
              </Button>
              {t("register.and")}
              <Button href="#" text>
                {t("register.privacy")}
              </Button>
            </CheckboxField>

            {/* Submit Button */}
            <div>
              <Button primary widthFull>
                {t("register.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpIcon, CheckIcon, EmailIcon } from "@/components/Icons";
import { InputField } from "@/components/Form";
import { Logo } from "@/components/ui";
import { ROUTE_PATHS } from "@/constants/routePaths";
import Button from "@/components/Button";
import { forgotPassword } from "@/services/auth";
import { forgotPasswordSchema, validationForm, type FormErrors } from "@/utils";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationForm(forgotPasswordSchema, { email }, setErrors)) return;
    setIsLoading(true);

    try {
      const res = await forgotPassword({ email });
      console.log(res);

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full max-w-lg space-y-8">
        {/* Logo Mobile */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo isLogin={false} variant="light" />
        </div>

        <div>
          <h2 className="text-crm-heading-text text-center text-2xl font-bold lg:text-left">
            {t("authPage.forgotPassword.title")}
          </h2>
          <p className="text-crm-label-text mt-2 text-center text-sm lg:text-left">
            {t("authPage.forgotPassword.subtitle")}
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <InputField
              id="email"
              name="email"
              type="email"
              label={t("authPage.forgotPassword.email")}
              placeholder="admin@center.edu"
              icon={<EmailIcon size="md" />}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email ? t(errors.email) : ""}
              required
            />

            <div className="flex justify-center">
              <Button
                large
                primary
                buttonTitle={
                  isLoading
                    ? "authPage.forgotPassword.sending"
                    : "authPage.forgotPassword.submit"
                }
              />
            </div>
          </form>
        ) : (
          <div className="border-crm-border bg-crm-surface rounded-2xl border p-6 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              {<CheckIcon />}
            </div>
            <h3 className="text-crm-heading-text text-lg font-semibold">
              {t("authPage.forgotPassword.successTitle")}
            </h3>
            <p className="text-crm-label-text mt-2 text-sm">
              {t("authPage.forgotPassword.successMsg")}
            </p>
          </div>
        )}

        {/* Login Button */}
        <div className="text-center">
          <Button
            to={ROUTE_PATHS.LOGIN}
            buttonTitle="authPage.forgotPassword.backToLogin"
            leftIcon={<ArrowUpIcon className="-rotate-90" />}
            className="text-crm-primary inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InputField } from "@/components/Form";
import Button from "@/components/Button";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { LockIcon } from "@/components/Icons";
import { resetPassword } from "@/services/auth";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("authPage.resetPassword.mismatch"));
      return;
    }

    setIsLoading(true);
    const payload = {
      token,
      newPassword,
    };

    console.log(payload);

    try {
      await resetPassword(payload);
      navigate(ROUTE_PATHS.LOGIN);
    } catch {
      setError(t("authPage.resetPassword.invalidToken"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <p>{t("authPage.resetPassword.missingToken")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <InputField
        id="newPassword"
        name="newPassword"
        type="password"
        label={t("authPage.resetPassword.newPassword")}
        icon={<LockIcon />}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <InputField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label={t("authPage.resetPassword.confirmPassword")}
        icon={<LockIcon />}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={error}
        required
      />
      <Button large primary disabled={isLoading}>
        {isLoading
          ? t("authPage.resetPassword.submitting")
          : t("authPage.resetPassword.submit")}
      </Button>
    </form>
  );
}

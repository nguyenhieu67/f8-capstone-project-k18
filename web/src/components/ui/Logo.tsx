import { useTranslation } from "react-i18next";

import { GraduationCapIcon } from "../Icons";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/routePaths";

interface LogoProps {
  subTitle?: boolean;
  variant?: "dark" | "light";
  isLogin?: boolean;
  className?: string;
}

export default function Logo({
  subTitle = false,
  variant = "dark",
  isLogin = true,
  className = "",
}: LogoProps) {
  const { t } = useTranslation();

  const titleColor =
    variant === "dark" ? "text-white" : "text-crm-heading-text";
  const subTitleColor =
    variant === "dark" ? "text-indigo-300" : "text-crm-label-text";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link to={isLogin ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.REVIEW}>
        <div className="from-crm-primary to-crm-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr shadow-lg">
          <GraduationCapIcon size={"lg"} fill="#fff" />
        </div>
      </Link>

      <div>
        <h1 className={`text-2xl leading-tight font-bold ${titleColor}`}>
          EduCRM
        </h1>
        {subTitle && (
          <span className={`font-medium ${subTitleColor}`}>
            {t("authPage.brand.subtitle")}
          </span>
        )}
      </div>
    </div>
  );
}

import { Logo } from "@/components/ui";
import { useTranslation } from "react-i18next";

interface Props {
  children: React.ReactNode;
  bannerPosition?: "left" | "right";
}

export default function AuthLayout({
  children,
  bannerPosition = "left",
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-crm-bg text-crm-heading-text relative flex min-h-screen w-full overflow-hidden font-sans antialiased ${
        bannerPosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* Banner Row */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-20">
          <div className="bg-crm-primary absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl"></div>
          <div className="bg-crm-secondary absolute bottom-10 left-10 h-72 w-72 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Logo isLogin={false} subTitle variant="dark" />
          <div className="mt-20">
            <h2 className="mb-6 text-5xl leading-tight font-bold whitespace-pre-line">
              {t("authPage.brand.heroTitle")}
            </h2>
            <p className="max-w-md text-lg text-slate-400">
              {t("authPage.brand.heroDesc")}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} EduCRM System. All rights reserved.
        </div>
      </div>

      {/* Content Form Row */}
      <div className="bg-crm-bg flex w-full items-center justify-center overflow-y-auto p-8 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}

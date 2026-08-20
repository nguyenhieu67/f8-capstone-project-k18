import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TriangleExclIcon } from "@/components/Icons";
import { ROUTE_PATHS } from "@/constants/routePaths";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans text-slate-800 antialiased">
      <div className="max-w-xl text-center">
        <div className="relative inline-block">
          <h1 className="text-[150px] leading-none font-black tracking-tighter text-slate-200 mix-blend-multiply select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/40">
              <TriangleExclIcon size={60} />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">
            {t("not_found.heading")}
          </h2>
          <p className="text-base text-slate-500">{t("not_found.desc")}</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={ROUTE_PATHS.DASHBOARD}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("not_found.back_home")}
          </Link>

          <Link
            to={ROUTE_PATHS.LOGIN}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            {t("not_found.relogin")}
          </Link>
        </div>

        <div className="mt-12 text-sm text-slate-400">
          {t("not_found.need_help")}{" "}
          <a href="#" className="text-indigo-500 hover:underline">
            {t("not_found.contact_it")}
          </a>
        </div>
      </div>
    </div>
  );
}

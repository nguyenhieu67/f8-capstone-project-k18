import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { LoadingSpinner, Logo } from "@/components/ui";
import { LanguageSelect } from "@/components/Form";
import { ROUTE_PATHS } from "@/constants/routePaths";
import {
  RightToBracketIcon,
  RectangleAdIcon,
  FilterCircleDollarIcon,
  ChalkboardUserIcon,
  FileInvoiceDollarIcon,
  ChartPieIcon,
  CircleCheckIcon,
  UsersGroupIcon,
  CompassIcon,
  DesktopIcon,
  StarIcon,
  BarsIcon,
} from "@/components/Icons";
import { useClickOutside } from "@/hooks";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface TitleDescI {
  title: string;
  desc: string;
}

const FEATURE_STYLES = [
  { icon: RectangleAdIcon, color: "bg-crm-primary shadow-crm-primary/20" },
  {
    icon: FilterCircleDollarIcon,
    color: "bg-crm-success shadow-crm-success/20",
  },
  {
    icon: ChalkboardUserIcon,
    color: "bg-crm-secondary shadow-crm-secondary/20",
  },
  { icon: UsersGroupIcon, color: "bg-crm-warning shadow-crm-warning/20" },
  { icon: FileInvoiceDollarIcon, color: "bg-crm-danger shadow-crm-danger/20" },
  { icon: ChartPieIcon, color: "bg-crm-info shadow-crm-info/20" },
];

const DIRECTORY_COLORS = [
  "text-crm-success",
  "text-crm-primary",
  "text-crm-warning",
  "text-crm-info",
  "text-crm-secondary",
  "text-crm-danger",
];
const DIRECTORY_ITEMS = [
  {
    path: "├── components/",
    note: "(UI, Form, Icons, Layouts)",
  },
  {
    path: "├── context/",
    note: "(AuthContext.ts)",
  },
  {
    path: "├── locales/",
    note: "(vi.json, en.json, ja.json)",
  },
  {
    path: "├── pages/",
    note: "(Dashboard, Auth, PreSales...)",
  },
  {
    path: "├── services/",
    note: "(authService, api.ts)",
  },
  {
    path: "└── utils/",
    note: "(i18n, validate, helpers)",
  },
];

const STATS_CONFIG = [
  { key: "revenue", color: "text-emerald-400" },
  { key: "leads", color: "text-indigo-400" },
  { key: "students", color: "text-sky-400" },
  { key: "payroll", color: "text-amber-400" },
];

export default function Review() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split("-")[0] : "vi";

  const { isOpen, setIsOpen, ref } = useClickOutside<HTMLDivElement>();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState<boolean>(true);

  const handleClose = () => {
    setIsOpen(false);
  };

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

  const features = t("homePage.features.items", {
    returnObjects: true,
  }) as TitleDescI[];
  const archPoints = t("homePage.architecture.points", {
    returnObjects: true,
  }) as TitleDescI[];
  const reviews = t("homePage.reviews.items", {
    returnObjects: true,
  }) as TitleDescI[];

  return (
    <div className="bg-crm-bg text-crm-heading-text min-h-screen font-sans antialiased">
      {/* Header */}
      <header className="bg-crm-surface/90 border-crm-border sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all">
        <div
          ref={ref}
          className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          <Logo isLogin={false} variant="light" />

          {/* Navigation Links */}
          <nav className="text-crm-label-text hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#overview" className="hover:text-crm-primary transition">
              {t("homePage.nav.overview")}
            </a>
            <a href="#feature" className="hover:text-crm-primary transition">
              {t("homePage.nav.features")}
            </a>
            <a
              href="#architecture"
              className="hover:text-crm-primary transition"
            >
              {t("homePage.nav.architecture")}
            </a>
            <a href="#overall" className="hover:text-crm-primary transition">
              {t("homePage.nav.reviews")}
            </a>
          </nav>

          {/* Language normal */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSelect
              value={currentLang}
              onChange={(code) => i18n.changeLanguage(code)}
              showIcon={false}
              className="w-auto"
            />
            <Button
              to={ROUTE_PATHS.REGISTER}
              text
              small
              buttonTitle="homePage.header.signIn"
              className="hidden sm:inline-flex"
            />
            <Button
              to={ROUTE_PATHS.LOGIN}
              primary
              rounded
              leftIcon={<RightToBracketIcon size="sm" />}
              buttonTitle="homePage.header.login"
            />
          </div>

          {/* Language mobile */}
          <div className="relative md:hidden">
            <BarsIcon onClick={() => setIsOpen(!isOpen)} />
          </div>
          {isOpen && (
            <div className="absolute top-0 right-0 z-10 mt-20 ml-auto w-[60%] rounded-bl-xl bg-white sm:w-[40%] md:hidden">
              <div className="p-6">
                <nav className="text-crm-label-text flex flex-col items-start gap-8 text-sm font-semibold md:hidden">
                  <a
                    href="#overview"
                    className="hover:text-crm-primary transition"
                    onClick={handleClose}
                  >
                    {t("homePage.nav.overview")}
                  </a>
                  <a
                    href="#feature"
                    className="hover:text-crm-primary transition"
                    onClick={handleClose}
                  >
                    {t("homePage.nav.features")}
                  </a>
                  <a
                    href="#architecture"
                    className="hover:text-crm-primary transition"
                    onClick={handleClose}
                  >
                    {t("homePage.nav.architecture")}
                  </a>
                  <a
                    href="#overall"
                    className="hover:text-crm-primary transition"
                    onClick={handleClose}
                  >
                    {t("homePage.nav.reviews")}
                  </a>
                </nav>

                <div className="mt-10 flex flex-col items-start gap-3 md:hidden">
                  <LanguageSelect
                    value={currentLang}
                    onChange={(code) => i18n.changeLanguage(code)}
                    showIcon={false}
                    className="w-auto"
                  />
                  <Button
                    to={ROUTE_PATHS.REGISTER}
                    text
                    small
                    buttonTitle="homePage.header.signIn"
                    className="hidden sm:inline-flex"
                    onClick={handleClose}
                  />
                  <Button
                    to={ROUTE_PATHS.LOGIN}
                    primary
                    rounded
                    leftIcon={<RightToBracketIcon size="sm" />}
                    buttonTitle="homePage.header.login"
                    onClick={handleClose}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section
        id="overview"
        className="from-crm-primary/10 via-crm-bg to-crm-bg relative overflow-hidden bg-linear-to-b pt-16 pb-20 lg:pt-24 lg:pb-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="bg-crm-primary/10 text-crm-primary border-crm-primary/20 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
              <span className="bg-crm-success h-2 w-2 animate-ping rounded-full" />
              {t("homePage.hero.badge")}
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {t("homePage.hero.title_1")}{" "}
              <span className="from-crm-primary via-crm-secondary to-crm-danger bg-linear-to-r bg-clip-text text-transparent">
                {t("homePage.hero.title_highlight")}
              </span>{" "}
              {t("homePage.hero.title_2")}
            </h1>

            <p className="text-crm-label-text text-lg leading-relaxed font-normal">
              {t("homePage.hero.desc")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="#feature"
                className="bg-crm-primary shadow-crm-primary/25 flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:opacity-90"
              >
                <CompassIcon className="h-4 w-4" />{" "}
                {t("homePage.hero.cta_explore")}
              </a>
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="bg-crm-surface hover:bg-crm-surface-soft border-crm-border text-crm-heading-text flex items-center gap-2 rounded-2xl border px-6 py-3.5 font-semibold shadow-sm transition-all"
              >
                <DesktopIcon className="h-4 w-4" />{" "}
                {t("homePage.hero.cta_demo")}
              </Link>
            </div>
          </div>

          {/* App Dashboard Preview */}
          <div className="ring-crm-border/40 mt-14 rounded-3xl bg-slate-900/5 p-3 shadow-2xl ring-1 backdrop-blur-xl">
            <div className="space-y-6 overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    {t("homePage.hero.preview_url")}
                  </span>
                </div>
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                  {t("homePage.hero.preview_badge")}
                </span>
              </div>

              {/* Preview Grid Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {STATS_CONFIG.map((stat) => (
                  <div
                    key={stat.key}
                    className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-4"
                  >
                    <span className="mb-1 block text-xs text-slate-400">
                      {t(`homePage.hero.stats.${stat.key}.label`)}
                    </span>
                    <span className={`text-xl font-bold ${stat.color}`}>
                      {t(`homePage.hero.stats.${stat.key}.value`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="feature"
        className="bg-crm-surface border-crm-border/80 border-y py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("homePage.features.heading")}
            </h2>
            <p className="text-crm-label-text">{t("homePage.features.desc")}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const { icon: Icon, color } =
                FEATURE_STYLES[index] ?? FEATURE_STYLES[0];
              return (
                <div
                  key={feature.title}
                  className="bg-crm-surface-soft border-crm-border/80 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md ${color}`}
                  >
                    <Icon size="sm" />
                  </div>
                  <h3 className="text-crm-heading-text mb-2 text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-crm-label-text text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack Review */}
      <section id="architecture" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="font-mono text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                {t("homePage.architecture.eyebrow")}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("homePage.architecture.heading")}
              </h2>
              <p className="text-sm leading-relaxed text-slate-400">
                {t("homePage.architecture.desc")}
              </p>

              <ul className="space-y-3 text-sm text-slate-300">
                {archPoints.map((point) => (
                  <li key={point.title} className="flex items-center gap-3">
                    <CircleCheckIcon
                      size="sm"
                      className="shrink-0 text-emerald-400"
                    />
                    <span>
                      <strong>{point.title}</strong> {point.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800 p-6 font-mono text-xs text-slate-300 shadow-2xl">
              <div className="mb-3 border-b border-slate-700 pb-2 font-bold text-slate-500">
                {t("homePage.architecture.directoryTitle")}
              </div>
              <div>web/src/</div>
              {DIRECTORY_ITEMS.map((item, index) => (
                <div
                  key={item.path}
                  className={`pl-4 ${DIRECTORY_COLORS[index] ?? DIRECTORY_COLORS[0]}`}
                >
                  {item.path}{" "}
                  <span className="text-slate-500">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overall Evaluation / Review Section */}
      <section id="overall" className="bg-crm-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("homePage.reviews.heading")}
            </h2>
            <p className="text-crm-label-text">{t("homePage.reviews.desc")}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.title}
                className="bg-crm-surface border-crm-border space-y-3 rounded-2xl border p-6 shadow-sm"
              >
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <h3 className="text-crm-heading-text text-base font-bold">
                  {review.title}
                </h3>
                <p className="text-crm-label-text text-xs leading-relaxed">
                  {review.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <Logo isLogin={false} variant="dark" className="justify-center" />
          </div>
          <p className="text-xs text-slate-500">
            © 2026 EduCRM Management Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

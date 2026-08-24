import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { RightToBracketIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/services/user";
import { navigationSections } from "./Navigation";
import { Logo } from "@/components/ui";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/routePaths";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    (async () => {
      updateUser(user.id, { langCode: i18n.language });
    })();
  }, [user, i18n]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="no-print z-20 flex h-screen w-64 shrink-0 flex-col bg-slate-900 text-slate-300 shadow-xl transition-all duration-300">
      {/* Header Logo */}
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        <Logo subTitle />
      </div>

      {/* Navigation Links */}
      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-3 text-sm">
        {navigationSections.map((section, sectionIdx) => (
          <React.Fragment key={section.translationKey}>
            <div
              className={`px-3 pb-1 text-xs font-semibold text-slate-500 uppercase ${
                sectionIdx === 0 ? "pt-3" : "pt-4"
              }`}
            >
              {t(section.translationKey)}
            </div>
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    const routeKey =
                      item.id.toUpperCase() as keyof typeof ROUTE_PATHS;
                    navigate(ROUTE_PATHS[routeKey]);
                  }}
                  id={`nav-${item.id}`}
                  className={`nav-btn flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium transition ${
                    isActive
                      ? "tab-active bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <IconComponent className="h-5 w-5 shrink-0 text-center" />
                  <span>{t(item.translationKey)}</span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      <Button
        rounded
        leftIcon={<RightToBracketIcon size={"sm"} />}
        className="mb-2 hover:bg-slate-800"
        onClick={handleLogout}
      >
        {t("authPage.logout")}
      </Button>

      {/* User profile section */}
      <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-950/50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20 text-sm font-bold text-indigo-400">
          {`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`}
        </div>
        <div className="flex-1 truncate">
          <div className="truncate text-sm font-semibold text-white">
            {user.role === "authorized"
              ? t("authPage.register.roles.authorized")
              : t("authPage.register.roles.admin")}
          </div>
          <div className="truncate text-xs text-slate-400">{user.email}</div>
        </div>
      </div>
    </aside>
  );
}

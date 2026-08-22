import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ChartPieIcon,
  RectangleAdIcon,
  FilterCircleDollarIcon,
  TrophyIcon,
  ChalkboardUserIcon,
  ClipboardUserIcon,
  BusinessTimeIcon,
  FileInvoiceDollarIcon,
  UsersGroupIcon,
  RightToBracketIcon,
} from "@/components/Icons";
import Logo from "./Logo";
import Button from "../Button";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { logout } from "@/services/auth";

interface NavItemConfig {
  id: string;
  translationKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSectionConfig {
  translationKey: string;
  items: NavItemConfig[];
}

const navigationSections: NavSectionConfig[] = [
  {
    translationKey: "dashboardPage.sidebar.sections.overview",
    items: [
      {
        id: "dashboard",
        translationKey: "dashboardPage.sidebar.items.dashboard",
        icon: ChartPieIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.salesAndAds",
    items: [
      {
        id: "sources",
        translationKey: "dashboardPage.sidebar.items.adSources",
        icon: RectangleAdIcon,
      },
      {
        id: "presales",
        translationKey: "dashboardPage.sidebar.items.preSalesData",
        icon: FilterCircleDollarIcon,
      },
      {
        id: "saleresults",
        translationKey: "dashboardPage.sidebar.items.salesResults",
        icon: TrophyIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.trainingAndStudents",
    items: [
      {
        id: "classes",
        translationKey: "dashboardPage.sidebar.items.classList",
        icon: ChalkboardUserIcon,
      },
      {
        id: "studentattendance",
        translationKey: "dashboardPage.sidebar.items.studentAttendance",
        icon: ClipboardUserIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.hrAndPayroll",
    items: [
      {
        id: "employees",
        translationKey: "dashboardPage.sidebar.items.employeeList",
        icon: UsersGroupIcon,
      },
      {
        id: "stafftimekeeping",
        translationKey: "dashboardPage.sidebar.items.staffTimekeeping",
        icon: BusinessTimeIcon,
      },
      {
        id: "payroll",
        translationKey: "dashboardPage.sidebar.items.payrollAndCommissions",
        icon: FileInvoiceDollarIcon,
      },
    ],
  },
];

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function Sidebar({
  activeTab: externalActiveTab,
  onTabChange,
}: SidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [internalActiveTab, setInternalActiveTab] = useState("dashboard");

  const currentTab = externalActiveTab ?? internalActiveTab;

  const handleSwitchTab = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      navigate(ROUTE_PATHS.REVIEW);
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
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSwitchTab(item.id)}
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
        Logout
      </Button>

      {/* User profile section */}
      <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-950/50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20 text-sm font-bold text-indigo-400">
          AD
        </div>
        <div className="flex-1 truncate">
          <div className="truncate text-sm font-semibold text-white">
            Admin Manager
          </div>
          <div className="truncate text-xs text-slate-400">
            nguyenphuongnga@center.edu
          </div>
        </div>
      </div>
    </aside>
  );
}

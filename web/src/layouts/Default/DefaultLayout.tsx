import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { findNavIdByPath, findNavItemById } from "./Navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const activeTab = useMemo(() => findNavIdByPath(pathname), [pathname]);

  const pageTitle = useMemo(() => {
    const navItem = findNavItemById(activeTab);
    return navItem ? t(navItem.translationKey) : "";
  }, [activeTab, t]);

  return (
    <div>
      {/* Main */}
      <div className="flex">
        {/* SideBar */}
        <Sidebar activeTab={activeTab} />
        <div className="w-screen">
          <Header title={pageTitle} />
          <div className="bg-crm-bg -mt-16 h-screen pt-16">
            <div className="flex flex-col gap-5 p-5">{children}</div>
          </div>
        </div>
      </div>
      {/* Footer */}
    </div>
  );
}

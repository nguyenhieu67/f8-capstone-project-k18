import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { findNavItemById } from "./Navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");

  const pageTitle = useMemo(() => {
    const navItem = findNavItemById(activeTab);
    return navItem ? t(navItem.translationKey) : "";
  }, [activeTab, t]);

  return (
    <div>
      {/* Main */}
      <div className="flex">
        {/* SideBar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
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

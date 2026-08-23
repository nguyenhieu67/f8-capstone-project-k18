import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { findNavItemById } from "./Navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  HeaderActionProvider,
  useHeaderActionContext,
} from "@/context/HeaderActionContext";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  return (
    <HeaderActionProvider>
      <DefaultLayoutContent>{children}</DefaultLayoutContent>
    </HeaderActionProvider>
  );
}

function DefaultLayoutContent({ children }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { primaryAction } = useHeaderActionContext();

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
          <Header title={pageTitle} primaryAction={primaryAction} />
          <div className="bg-crm-bg -mt-16 h-screen pt-16">{children}</div>
        </div>
      </div>
      {/* Footer */}
    </div>
  );
}

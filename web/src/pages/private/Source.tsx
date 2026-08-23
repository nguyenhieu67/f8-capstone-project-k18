import { useHeaderAction } from "@/context/HeaderActionContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Source() {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  useHeaderAction(
    {
      label: t("dashboardPage.header.add.source"),
      onClick: () => setModalOpen(true),
    },
    [t],
  );

  return <div>Source</div>;
}

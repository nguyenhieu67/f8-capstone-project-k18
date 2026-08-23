import { useHeaderAction } from "@/context/HeaderActionContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Classe() {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  useHeaderAction(
    {
      label: t("dashboardPage.header.add.class"),
      onClick: () => setModalOpen(true),
    },
    [t],
  );

  return <div>Classe</div>;
}

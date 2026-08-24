import Dialog from "./Dialog";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  loading?: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteDialog({
  isOpen,
  loading = false,
  description,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title="common.dialog.confirmDelete"
      buttonAction="common.button.delete"
      buttonColor="bg-crm-danger"
      onClose={onClose}
      onSubmit={onConfirm}
    >
      <p className="py-3 text-sm text-gray-600">
        {t(description || t("common.dialog.deleteWarning"))}
      </p>
    </Dialog>
  );
}

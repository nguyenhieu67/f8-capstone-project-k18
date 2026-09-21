import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createSource } from "@/services/source";
import type { SourceI } from "@/types/database";
import {
  DEFAULT_SOURCE_ICON,
  SOURCE_ICON_OPTIONS,
  getSourceColor,
} from "@/constants/sourceIcon";
import { useAppToast, useForm } from "@/hooks";

interface SourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS = [
  { label: "common.status.active", value: "active" },
  { label: "common.status.inactive", value: "inactive" },
];

const DEFAULT_FORM: SourceI = {
  name: "",
  color: getSourceColor(DEFAULT_SOURCE_ICON),
  icon: DEFAULT_SOURCE_ICON,
  status: "active",
};

export default function SourceDialog({
  isOpen,
  onClose,
  onSuccess,
}: SourceDialogProps) {
  const { formData, setFormData, handleChange } = useForm(DEFAULT_FORM, {
    customHandlers: {
      icon: (value) => ({
        color: getSourceColor(value),
      }),
    },
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const toastMsg = useAppToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      await createSource({ ...formData });
      setFormData(DEFAULT_FORM);
      onSuccess?.();
      onClose();
      toastMsg.success(t("sourcePage.toast.created"));
    } catch (error) {
      console.error("Failed to save source:", error);
      toastMsg.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title="common.button.addSource"
      buttonAction="common.button.addSource"
      icon={<PlusIcon />}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit} className="mb-5 space-y-4" noValidate>
        {/* Source name */}
        <InputField
          id="name"
          name="name"
          label="sourcePage.form.sourceName"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="sourcePage.form.sourceNamePlaceholder"
        />

        {/* Icon Select */}
        <SelectField
          id="icon"
          name="icon"
          label="sourcePage.form.icon"
          options={SOURCE_ICON_OPTIONS}
          value={formData.icon}
          onChange={handleChange}
        />

        {/* Status */}
        <SelectField
          id="status"
          name="status"
          label="common.tableHeader.status"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={handleChange}
        />
      </form>
    </Dialog>
  );
}

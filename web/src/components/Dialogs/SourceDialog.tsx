import { useState } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createSource } from "@/services/source";
import type { SourceI } from "@/types/database";
import { useAppToast, useForm } from "@/hooks";

interface SourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ICON_OPTIONS = [
  { label: "Facebook", value: "facebook" },
  { label: "Zalo", value: "zalo" },
  { label: "Instagram", value: "instagram" },
  { label: "Google", value: "google" },
  { label: "Website", value: "website" },
];

const ICON_COLOR_MAP: Record<string, string> = {
  facebook: "#1877F2",
  zalo: "#0068FF",
  instagram: "#E95950",
  google: "#FBBC05",
  website: "#8B5CF6",
};

const STATUS_OPTIONS = [
  { label: "common.status.active", value: "active" },
  { label: "common.status.inactive", value: "inactive" },
];

const DEFAULT_FORM: SourceI = {
  name: "",
  color: "#1877F2",
  icon: "facebook",
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
        color: ICON_COLOR_MAP[value] || "#1877F2",
      }),
    },
  });
  const [loading, setLoading] = useState(false);
  const toastMsg = useAppToast();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await createSource({ ...formData });
      setFormData(DEFAULT_FORM);
      onSuccess?.();
      onClose();
      toastMsg.success("Tạo thành công Nguồn quáng cáo.");
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
          label="Icon"
          options={ICON_OPTIONS}
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

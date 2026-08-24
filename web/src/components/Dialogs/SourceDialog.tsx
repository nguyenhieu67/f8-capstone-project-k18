import { useState } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createSource } from "@/services/source";

export interface SourceI {
  id?: number;
  name: string;
  color: string;
  icon: string;
  status: "active" | "inactive";
}

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

const INITIAL_FORM: SourceI = {
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
  const [formData, setFormData] = useState<SourceI>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "icon") {
      const autoColor = ICON_COLOR_MAP[value] || "#1877F2";
      setFormData((prev) => ({
        ...prev,
        icon: value,
        color: autoColor,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createSource({ ...formData });
      setFormData(INITIAL_FORM);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save source:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="common.buttonTitle.addSource"
      icon={<PlusIcon />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Source name */}
        <InputField
          id="name"
          name="name"
          label="Tên nguồn"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Ví dụ: Zalo OA, Facebook Ads..."
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
          label="Trạng thái"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={handleChange}
        />

        {/* Action Buttons */}
        <div className="border-crm-border flex justify-end gap-2 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border-crm-border bg-crm-surface text-crm-heading-text hover:bg-crm-menu-item-bg-hover rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-crm-primary rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu nguồn"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

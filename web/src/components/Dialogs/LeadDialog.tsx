import { useState, useEffect } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createLead, updateLead } from "@/services/lead";
import { useForm } from "@/hooks";
import type { LeadI, EmployeeI, SourceI } from "@/types/database";

interface LeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: LeadI | null;
  sellers?: EmployeeI[];
  sources?: SourceI[];
}

const STATUS_OPTIONS = [
  { label: "leadPage.status.new", value: "new" },
  { label: "leadPage.status.contacted", value: "contacted" },
  { label: "leadPage.status.qualified", value: "qualified" },
  { label: "leadPage.status.converted", value: "converted" },
  { label: "leadPage.status.lost", value: "lost" },
];

const DEFAULT_FORM: LeadI = {
  firstName: "",
  lastName: "",
  phone: "",
  sellerId: "",
  sourceId: "",
  purpose: "",
  who: "",
  status: "new",
  rejectionReason: "",
};

export default function LeadDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  sellers = [],
  sources = [],
}: LeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useForm(DEFAULT_FORM, {
    numberFields: ["sellerId", "sourceId"],
  });

  const isEdit = Boolean(initialData?.id);

  // Parse danh sách Seller cho SelectField
  const sellerOptions = [
    { label: "leadPage.form.selectSales", value: "" },
    ...sellers.map((s) => ({
      label: s.fullName || `Sales #${s.id}`,
      value: String(s.id),
    })),
  ];

  // Parse danh sách Source cho SelectField
  const sourceOptions = [
    { label: "leadPage.form.selectSource", value: "" },
    ...sources.map((src) => ({
      label: src.name,
      value: String(src.id),
    })),
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_FORM);
    }
  }, [isOpen, initialData, setFormData]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        sellerId: formData.sellerId ? Number(formData.sellerId) : undefined,
        sourceId: formData.sourceId ? Number(formData.sourceId) : undefined,
      };

      if (isEdit && formData.id) {
        await updateLead(formData.id, payload);
      } else {
        await createLead(payload);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title={isEdit ? "common.button.update" : "common.button.addLead"}
      buttonAction={isEdit ? "common.button.save" : "common.button.addLead"}
      widthSize="lg"
      icon={isEdit ? "" : <PlusIcon />}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <form className="mb-5 space-y-4" noValidate>
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="firstName"
            name="firstName"
            label="authPage.register.firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="authPage.register.firstNamePlaceholder"
          />
          <InputField
            id="lastName"
            name="lastName"
            label="authPage.register.lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="authPage.register.lastNamePlaceholder"
          />
        </div>

        {/* Phone & Status */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="phone"
            name="phone"
            type="tel"
            label="common.tableHeader.phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0912345678"
          />
          <SelectField
            id="status"
            name="status"
            label="common.tableHeader.status"
            required
            options={STATUS_OPTIONS}
            value={formData.status}
            onChange={handleChange}
          />
        </div>

        {/* Seller & Source */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="sellerId"
            name="sellerId"
            label="common.tableHeader.seller"
            options={sellerOptions}
            value={String(formData.sellerId || "")}
            onChange={handleChange}
          />
          <SelectField
            id="sourceId"
            name="sourceId"
            label="common.tableHeader.source"
            options={sourceOptions}
            value={String(formData.sourceId || "")}
            onChange={handleChange}
          />
        </div>

        {/* Purpose & Who */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="purpose"
            name="purpose"
            label="common.tableHeader.purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="leadPage.form.demandPlaceholder"
          />
          <InputField
            id="who"
            name="who"
            label="common.tableHeader.who"
            value={formData.who}
            onChange={handleChange}
            placeholder="leadPage.form.jobPlaceholder"
          />
        </div>

        {formData.status === "lost" && (
          <InputField
            id="rejectionReason"
            name="rejectionReason"
            label="common.tableHeader.rejectionReason"
            value={formData.rejectionReason}
            onChange={handleChange}
            placeholder="leadPage.form.reasonPlaceholder"
          />
        )}
      </form>
    </Dialog>
  );
}

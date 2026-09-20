import { useState, useEffect } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createLead, updateLead } from "@/services/lead";
import { useAppToast, useForm } from "@/hooks";
import type { LeadI, EmployeeI, SourceI, ClasseI } from "@/types/database";
import { formatCurrency } from "@/utils/format";

interface LeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: LeadI | null;
  sellers?: EmployeeI[];
  sources?: SourceI[];
  classes?: ClasseI[];
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
  classeId: "",
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
  classes = [],
}: LeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useForm(DEFAULT_FORM, {
    numberFields: ["sellerId", "sourceId"],
  });
  const toastMsg = useAppToast();

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

  // Parse danh sách Source cho SelectField
  const classeOptions = [
    { label: "leadPage.form.selectClasse", value: "" },
    ...classes.map((c) => ({
      label: `${c.name} - ${formatCurrency(c.tuition)}`,
      value: String(c.id),
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
        classeId: formData.classeId ? Number(formData.classeId) : undefined,
        purpose: formData.purpose ? formData.purpose : null,
        who: formData.who ? formData.who : null,
        rejectionReason:
          formData.status === "lost"
            ? formData.rejectionReason
              ? formData.rejectionReason
              : null
            : null,
      };

      if (isEdit && formData.id) {
        await updateLead(formData.id, payload);
        toastMsg.success(
          `Cập nhật thành công PreSale với tên là: ${formData.fullName}.`,
        );
      } else {
        await createLead(payload);
        toastMsg.success("Tạo thành công PreSale mới.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
      toastMsg.error((error as Error).message);
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

        {/*  Class & Rejection reason */}
        <div>
          {formData.status === "converted" && (
            <SelectField
              id="classeId"
              name="classeId"
              label="common.tableHeader.class"
              options={classeOptions}
              value={String(formData.classeId || "")}
              onChange={handleChange}
            />
          )}

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
        </div>
      </form>
    </Dialog>
  );
}

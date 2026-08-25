import { useState, useEffect } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, SelectField } from "../Form";
import { createEmployee, updateEmployee } from "@/services/employee";
import { useForm } from "@/hooks";

export interface EmployeeI {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  role: "trainer" | "sale" | "assistant" | "manager" | "admin";
  phone: string;
  salary: number;
  commissionRate: number;
  dependents: number;
}

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: EmployeeI | null;
}

const ROLE_OPTIONS = [
  { label: "Sales (Tư vấn viên)", value: "sale" },
  { label: "Giảng viên (Trainer)", value: "trainer" },
  { label: "Trợ giảng (Assistant)", value: "assistant" },
  { label: "Quản lý (Manager)", value: "manager" },
  { label: "Quản trị viên (Admin)", value: "admin" },
];

const DEFAULT_FORM: EmployeeI = {
  firstName: "",
  lastName: "",
  position: "",
  role: "sale",
  phone: "",
  salary: 0,
  commissionRate: 0,
  dependents: 0,
};

export default function EmployeeDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: EmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useForm(DEFAULT_FORM, {
    numberFields: ["salary", "commissionRate", "dependents"],
  });

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_FORM);
    }
  }, [isOpen, initialData, setFormData]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit && formData.id) {
        await updateEmployee(formData.id, { ...formData });
      } else {
        await createEmployee({ ...formData });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title={isEdit ? "common.button.update" : "common.button.addEmployee"}
      buttonAction={isEdit ? "common.button.save" : "common.button.addEmployee"}
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
            placeholder="authPage.register.firstName"
          />
          <InputField
            id="lastName"
            name="lastName"
            label="authPage.register.lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="authPage.register.lastName"
          />
        </div>

        {/* Position & Role */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="position"
            name="position"
            label="common.tableHeader.position"
            value={formData.position}
            onChange={handleChange}
            placeholder="common.tableHeader.position"
          />
          <SelectField
            id="role"
            name="role"
            label="common.tableHeader.role"
            required
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <InputField
          id="phone"
          name="phone"
          type="tel"
          label="common.tableHeader.phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0912345678"
        />

        {/* Salary & Commission Rate */}
        <div className="grid grid-cols-3 gap-3">
          <InputField
            id="salary"
            name="salary"
            type="number"
            label="common.tableHeader.baseSalary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="10000000"
          />
          <InputField
            id="commissionRate"
            name="commissionRate"
            type="number"
            label="common.tableHeader.commissionRate"
            value={formData.commissionRate}
            onChange={handleChange}
            placeholder="0"
          />
          <InputField
            id="dependents"
            name="dependents"
            type="number"
            label="common.tableHeader.dependents"
            value={formData.dependents}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </form>
    </Dialog>
  );
}

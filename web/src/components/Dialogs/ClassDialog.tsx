import { useState, useEffect } from "react";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import { InputField, ScheduleSelector, SelectField } from "../Form";
import { createClasse, updateClasse } from "@/services/classe";
import { useAppToast, useForm } from "@/hooks";
import type { ClasseI, EmployeeI } from "@/types/database";

interface ClassDialogProps {
  isOpen: boolean;
  initialData?: ClasseI | null;
  trainers?: EmployeeI[];
  onClose: () => void;
  onSuccess?: () => void;
  onDelete?: () => void;
}

const STATUS_OPTIONS = [
  { label: "classPage.status.opening", value: "opening" },
  { label: "classPage.status.ongoing", value: "ongoing" },
  { label: "classPage.status.completed", value: "completed" },
  { label: "classPage.status.closed", value: "closed" },
];

const DEFAULT_FORM: ClasseI = {
  code: "",
  name: "",
  trainerId: "",
  schedule: "",
  tuition: 0,
  status: "opening",
};

export default function ClassDialog({
  isOpen,
  initialData,
  trainers = [],
  onClose,
  onSuccess,
  onDelete,
}: ClassDialogProps) {
  const { formData, setFormData, handleChange, resetForm } = useForm(
    DEFAULT_FORM,
    {
      numberFields: ["tuition"],
    },
  );
  const [loading, setLoading] = useState(false);
  const toastMsg = useAppToast();

  const isEdit = Boolean(initialData?.id);

  const trainerOptions = [
    { label: "classPage.filter.selectTrainer", value: "" },
    ...trainers.map((t) => {
      return {
        label: t.fullName || `classPage.details.trainer #${t.id}`,
        value: String(t.id),
      };
    }),
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
        trainerId: formData.trainerId ? Number(formData.trainerId) : undefined,
      };

      if (isEdit && formData.id) {
        await updateClasse(formData.id, payload);
        toastMsg.success(
          `Cập nhật thành công Classe với tên là: ${formData.name}.`,
        );
      } else {
        await createClasse(payload);
        toastMsg.success("Tạo thành công Classe mới.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save class:", error);
      toastMsg.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title={isEdit ? "common.button.update" : "common.button.addClass"}
      buttonAction={isEdit ? "common.button.save" : "common.button.addClass"}
      widthSize="lg"
      icon={isEdit ? "" : <PlusIcon />}
      onClose={onClose}
      onSubmit={handleSubmit}
      onReset={resetForm}
      onDelete={isEdit ? onDelete : undefined}
    >
      <form className="mb-5 space-y-4" noValidate>
        {/* Code & Name */}
        <div className="grid grid-cols-3 gap-4">
          <InputField
            id="code"
            name="code"
            label="classPage.createModal.classCode"
            required
            value={formData.code}
            onChange={handleChange}
            placeholder="classPage.createModal.classCodePlaceholder"
          />
          <div className="col-span-2">
            <InputField
              id="name"
              name="name"
              label="classPage.createModal.className"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="classPage.createModal.classNamePlaceholder"
            />
          </div>
        </div>

        {/* Trainer & Tuition */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="trainerId"
            name="trainerId"
            label="classPage.createModal.trainer"
            options={trainerOptions}
            value={String(formData.trainerId || "")}
            onChange={handleChange}
          />
          <InputField
            id="tuition"
            name="tuition"
            type="number"
            label="classPage.createModal.tuition"
            required
            value={formData.tuition}
            onChange={handleChange}
          />
        </div>

        {/* Schedule */}
        <ScheduleSelector
          value={formData.schedule}
          onChange={(newSchedule) => {
            setFormData((prev) => ({ ...prev, schedule: newSchedule }));
          }}
        />

        {/* Status */}
        <SelectField
          id="status"
          name="status"
          label="classPage.createModal.status"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={handleChange}
        />
      </form>
    </Dialog>
  );
}

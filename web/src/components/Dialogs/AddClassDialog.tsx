import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppToast } from "@/hooks";
import { addLeadEnrollment } from "@/services/lead";
import type { ClasseI, LeadI } from "@/types/database";
import { getLeadEnrolledClasses } from "@/utils/enrollment";
import { formatCurrency } from "@/utils/format";
import { SelectField } from "../Form";
import { PlusIcon } from "../Icons";
import Dialog from "./Dialog";
import EnrolledClassList from "./EnrolledClassList";

interface AddClassDialogProps {
  isOpen: boolean;
  lead: LeadI;
  classes: ClasseI[];
  onClose: () => void;
  onSuccess?: () => void;
}

const isEnrollable = (c: ClasseI) =>
  c.status !== "closed" && c.status !== "completed";

export default function AddClassDialog({
  isOpen,
  lead,
  classes,
  onClose,
  onSuccess,
}: AddClassDialogProps) {
  const { t } = useTranslation();
  const toastMsg = useAppToast();
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  const enrolledIds = getLeadEnrolledClasses(lead).map((e) => e.classId);

  const availableClasses = classes.filter(
    (c) => isEnrollable(c) && !enrolledIds.includes(Number(c.id)),
  );
  const options = [
    { label: "leadPage.addClass.selectPlaceholder", value: "" },
    ...availableClasses.map((c) => ({
      label: `${c.name} - ${formatCurrency(c.tuition)}`,
      value: String(c.id),
    })),
  ];

  const handleSubmit = async () => {
    if (!classId) {
      toastMsg.error(t("leadPage.addClass.selectRequired"));
      return;
    }

    setLoading(true);
    try {
      await addLeadEnrollment(Number(lead.id), Number(classId));
      const className =
        classes.find((c) => c.id === Number(classId))?.name ?? classId;
      toastMsg.success(
        t("leadPage.addClass.toast.added", {
          student: lead.fullName,
          name: className,
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to add class:", error);
      toastMsg.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      loading={loading}
      title="leadPage.addClass.title"
      icon={<PlusIcon size="sm" />}
      widthSize="md"
      buttonAction="leadPage.addClass.submit"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="mb-5 space-y-5">
        <div className="border-crm-border bg-crm-surface-soft rounded-xl border px-4 py-3">
          <p className="text-crm-heading-text text-lg font-bold">
            {lead.fullName}
          </p>
          <p className="text-crm-primary font-mono text-sm">{lead.phone}</p>
        </div>

        <div>
          <h4 className="text-crm-label-text border-crm-border mb-2 border-b pb-1 text-xs font-bold tracking-wider uppercase">
            {t("leadPage.classList.heading")} ({enrolledIds.length})
          </h4>
          <EnrolledClassList lead={lead} classes={classes} />
        </div>

        {availableClasses.length > 0 ? (
          <SelectField
            id="addClassId"
            name="addClassId"
            label="leadPage.addClass.selectLabel"
            options={options}
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
        ) : (
          <p className="text-crm-label-text text-sm">
            {t("leadPage.addClass.noAvailable")}
          </p>
        )}
      </div>
    </Dialog>
  );
}

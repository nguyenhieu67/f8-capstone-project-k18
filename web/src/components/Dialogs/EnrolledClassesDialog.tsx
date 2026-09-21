import { useTranslation } from "react-i18next";

import type { ClasseI, LeadI } from "@/types/database";
import { getLeadEnrolledClasses } from "@/utils/enrollment";
import { GraduationCapIcon } from "../Icons";
import Dialog from "./Dialog";
import EnrolledClassList from "./EnrolledClassList";

interface EnrolledClassesDialogProps {
  isOpen: boolean;
  lead: LeadI;
  classes: ClasseI[];
  onClose: () => void;
  onAddClass: (lead: LeadI) => void;
}

export default function EnrolledClassesDialog({
  isOpen,
  lead,
  classes,
  onClose,
  onAddClass,
}: EnrolledClassesDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      loading={false}
      title="leadPage.classList.title"
      icon={<GraduationCapIcon size="sm" />}
      widthSize="md"
      buttonAction="leadPage.addClass.button"
      onClose={onClose}
      onSubmit={async () => onAddClass(lead)}
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
            {t("leadPage.classList.heading")} (
            {getLeadEnrolledClasses(lead).length})
          </h4>
          <EnrolledClassList lead={lead} classes={classes} />
        </div>
      </div>
    </Dialog>
  );
}

import { useTranslation } from "react-i18next";

import type { ClasseI, LeadI } from "@/types/database";
import {
  ENROLLMENT_STATUS,
  getEnrollmentDisplayStatus,
  getLeadEnrolledClasses,
} from "@/utils/enrollment";

interface EnrolledClassListProps {
  lead: LeadI;
  classes: ClasseI[];
}

export default function EnrolledClassList({
  lead,
  classes,
}: EnrolledClassListProps) {
  const { t } = useTranslation();

  return (
    <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
      {getLeadEnrolledClasses(lead).map(({ classId, status }) => {
        const classe = classes.find((c) => c.id === classId);
        const display =
          ENROLLMENT_STATUS[getEnrollmentDisplayStatus(status, classe?.status)];

        return (
          <li key={classId} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: display.color }}
            />
            {classe?.code && (
              <span className="text-crm-label-text font-mono">
                {classe.code}
              </span>
            )}
            <span className="text-crm-accent font-medium">
              {classe?.name ?? `#${classId}`}
            </span>
            <span
              className="ml-auto shrink-0 text-xs font-semibold"
              style={{ color: display.color }}
            >
              {t(display.label)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

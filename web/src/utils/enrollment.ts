import type {
  ClassStatus,
  LeadEnrolledClassI,
  LeadI,
  StudentClasseStatus,
} from "@/types/database";

export type EnrollmentDisplayStatus =
  "enrolled" | "learning" | "completed" | "closed";

export const ENROLLMENT_STATUS: Record<
  EnrollmentDisplayStatus,
  { label: string; color: string }
> = {
  enrolled: {
    label: "leadPage.classStatus.enrolled",
    color: "var(--crm-success)",
  },
  learning: {
    label: "leadPage.classStatus.learning",
    color: "var(--crm-info)",
  },
  completed: {
    label: "leadPage.classStatus.completed",
    color: "var(--crm-accent)",
  },
  closed: {
    label: "classPage.status.closed",
    color: "var(--crm-label-text)",
  },
};

export function getEnrollmentDisplayStatus(
  enrollmentStatus?: StudentClasseStatus,
  classStatus?: ClassStatus,
): EnrollmentDisplayStatus {
  if (enrollmentStatus === "completed" || classStatus === "completed") {
    return "completed";
  }
  if (classStatus === "closed") return "closed";
  if (classStatus === "ongoing") return "learning";
  return "enrolled";
}

export function getLeadEnrolledClasses(lead: LeadI): LeadEnrolledClassI[] {
  if (lead.enrolledClasses?.length) return lead.enrolledClasses;
  return lead.classeId
    ? [{ classId: Number(lead.classeId), status: "active" }]
    : [];
}

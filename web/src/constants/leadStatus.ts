import type { LeadStatus } from "@/types/database";

export interface LeadStatusI {
  label: string;
  color: string;
}

export const LEAD_STATUS: Record<LeadStatus, LeadStatusI> = {
  new: { label: "leadPage.status.new", color: "var(--crm-info)" },
  contacted: {
    label: "leadPage.status.contacted",
    color: "var(--crm-warning)",
  },
  qualified: {
    label: "leadPage.status.qualified",
    color: "var(--crm-accent)",
  },
  converted: {
    label: "leadPage.status.converted",
    color: "var(--crm-success)",
  },
  lost: { label: "leadPage.status.lost", color: "var(--crm-danger)" },
};

export const LEAD_STATUS_OPTIONS = (
  Object.keys(LEAD_STATUS) as LeadStatus[]
).map((value) => ({ label: LEAD_STATUS[value].label, value }));

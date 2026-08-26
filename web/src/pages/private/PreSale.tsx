/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { ConfirmDeleteDialog, LeadDialog } from "@/components/Dialogs";
import { PlusIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { StatusBadge } from "@/components/ui";
import { useFetchData, useTableActions } from "@/hooks";
import { getEmployees } from "@/services/employee";
import { deleteLead, getLeads } from "@/services/lead";
import { getSources } from "@/services/source";
import type { EmployeeI, LeadI, LeadStatus, SourceI } from "@/types/database";
import type { ColumnI } from "@/types/table";
import { useMemo } from "react";

const LEAD_STATUS = {
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

const getColumns = (
  sources: SourceI[],
  employees: EmployeeI[],
): ColumnI<LeadI>[] => [
  {
    value: "customerPhone",
    text: "common.tableHeader.customerPhone",
    render: (l) => (
      <div className="flex flex-col">
        <h4 className="text-crm-heading-text text-[16px] font-bold">
          {l.fullName}
        </h4>
        <span className="text-crm-primary font-mono text-sm">{l.phone}</span>
      </div>
    ),
  },
  {
    value: "adSource",
    text: "common.tableHeader.adSource",
    render: (l) => (
      <span className="font-medium">
        {sources.find((s) => s.id === Number(l.sourceId))?.name ?? ""}
      </span>
    ),
  },
  {
    value: "learningPurpose",
    text: "common.tableHeader.learningPurpose",
    render: (l) => l.purpose,
  },
  {
    value: "targetAudience",
    text: "common.tableHeader.targetAudience",
    render: (l) => l.who,
  },
  {
    value: "assignedSeller",
    text: "common.tableHeader.assignedSeller",
    render: (l) => (
      <span className="text-crm-heading-text font-semibold">
        {employees.find((e) => e.id === Number(l.sellerId))?.fullName ?? ""}
      </span>
    ),
  },
  {
    value: "status",
    text: "common.tableHeader.status",
    render: (lead: LeadI) => {
      const status = LEAD_STATUS[lead.status as LeadStatus];
      return <StatusBadge label={status.label} color={status.color} />;
    },
  },
  {
    value: "rejectionReason",
    text: "common.tableHeader.rejectionReason",
    render: (l) => (
      <span className="text-crm-danger font-medium">
        {l.rejectionReason === "" ? "-----" : l.rejectionReason}
      </span>
    ),
  },
  { value: "actions", text: "common.tableHeader.actions" },
];

export default function PreSale() {
  const { data, refetch } = useFetchData(
    {
      leads: () => getLeads() as Promise<LeadI[]>,
      sources: () => getSources() as Promise<SourceI[]>,
      employees: () => getEmployees() as Promise<EmployeeI[]>,
    },
    [],
  );

  const leads: LeadI[] = data?.leads || [];
  const sources: SourceI[] = data?.sources || [];
  const employees: EmployeeI[] = data?.employees || [];

  const actions = useTableActions<LeadI>(
    refetch,
    deleteLead as (id: string | number) => Promise<void>,
  );

  const columns = useMemo(
    () => getColumns(sources, employees),
    [sources, employees],
  );

  const sellers = useMemo(
    () => employees?.filter((e) => e.role === "sale"),
    [employees],
  );

  return (
    <>
      <div>
        <CardBase>
          <Button
            buttonTitle="common.button.addLead"
            gradient
            leftIcon={<PlusIcon size="sm" />}
            onClick={actions.handleOpenCreate}
          />
        </CardBase>
      </div>
      <div>
        <CardBase>
          <Table<LeadI>
            columns={columns}
            rows={leads}
            height="max-h-173"
            onEdit={(row) => actions.handleOpenEdit(leads || [], row)}
            onDelete={actions.handleOpenDelete}
          />
          <LeadDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
            initialData={actions.selectedItem}
            sources={sources}
            sellers={sellers}
          />
          <ConfirmDeleteDialog
            isOpen={actions.isDeleteOpen}
            loading={actions.deleteLoading}
            onClose={actions.handleCloseDelete}
            onConfirm={actions.handleConfirmDelete}
          />
        </CardBase>
      </div>
    </>
  );
}

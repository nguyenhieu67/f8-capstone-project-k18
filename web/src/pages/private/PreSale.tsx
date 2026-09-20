import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { ConfirmDeleteDialog, LeadDialog } from "@/components/Dialogs";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { StatusBadge } from "@/components/ui";
import { useFetchData, usePagination, useTableActions } from "@/hooks";
import { getClasses } from "@/services/classe";
import { getEmployees } from "@/services/employee";
import { deleteLead, getLeads } from "@/services/lead";
import { getSources } from "@/services/source";
import type {
  ClasseI,
  EmployeeI,
  LeadI,
  LeadStatus,
  SourceI,
} from "@/types/database";
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
  classes: ClasseI[],
  onActionEdit: (row: LeadI) => void,
  onActionDelete: (row: LeadI) => void,
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
    render: (l) =>
      l.purpose ?? <span className="text-crm-danger font-medium">-</span>,
  },
  {
    value: "targetAudience",
    text: "common.tableHeader.targetAudience",
    render: (l) =>
      l.who ?? <span className="text-crm-danger font-medium">-</span>,
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
    value: "class",
    text: "common.tableHeader.class",
    render: (l) => (
      <span className="text-crm-accent font-medium">
        {classes.find((c) => c.id === Number(l.classeId))?.name ?? (
          <span className="text-crm-danger">-</span>
        )}
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
        {l.rejectionReason ?? "-"}
      </span>
    ),
  },
  {
    value: "customAction",
    text: "common.tableHeader.actions",
    render: (l: LeadI) => {
      if (l.status === "converted") {
        return (
          <div className="text-crm-success flex items-center gap-1.5 text-xs font-medium">
            <span className="bg-crm-success h-2 w-2 rounded-full"></span>
            <span>Đã vào lớp</span>
          </div>
        );
      }

      if (l.status === "lost") {
        return <span className="text-crm-danger text-xs">-----</span>;
      }

      return (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onActionEdit(l)}
            className="text-crm-label-text hover:text-crm-info cursor-pointer rounded p-1 transition hover:bg-slate-100"
            title="Chỉnh sửa"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => onActionDelete(l)}
            className="text-crm-label-text hover:text-crm-danger cursor-pointer rounded p-1 transition hover:bg-slate-100"
            title="Xóa"
          >
            <TrashIcon />
          </button>
        </div>
      );
    },
  },
];

export default function PreSale() {
  const { page, limit, onPageChange, onLimitChange } = usePagination(10);
  const { data, refetch } = useFetchData(
    {
      leads: () => getLeads(page, limit),
      sources: () => getSources(),
      employees: () => getEmployees(),
      classes: () => getClasses(),
    },
    [page, limit],
  );

  const leads = useMemo(() => data?.leads.items || [], [data?.leads.items]);
  const total = data?.leads.total ?? 0;
  const sources = useMemo(
    () => data?.sources.items || [],
    [data?.sources.items],
  );
  const employees = useMemo(
    () => data?.employees.items || [],
    [data?.employees.items],
  );
  const classes = useMemo(
    () => data?.classes.items.filter((c) => c.status !== "closed") || [],
    [data?.classes.items],
  );

  const actions = useTableActions<LeadI>(
    refetch,
    deleteLead as (id: string | number) => Promise<void>,
  );

  const columns = useMemo(
    () =>
      getColumns(
        sources,
        employees,
        classes,
        (row) => actions.handleOpenEdit(leads, row),
        (row) => actions.handleOpenDelete(row),
      ),
    [sources, employees, classes, actions, leads],
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
            height="max-h-[calc(100vh-300px)]"
            onEdit={(row) => actions.handleOpenEdit(leads || [], row)}
            onDelete={actions.handleOpenDelete}
            page={page}
            limit={limit}
            total={total}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
          <LeadDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
            initialData={actions.selectedItem}
            sources={sources}
            sellers={sellers}
            classes={classes}
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

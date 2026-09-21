import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { InputField, SelectField } from "@/components/Form";
import { ConfirmDeleteDialog, LeadDialog } from "@/components/Dialogs";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { StatusBadge } from "@/components/ui";
import {
  useDebounce,
  useFetchData,
  usePagination,
  useTableActions,
} from "@/hooks";
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
import { LEAD_STATUS, LEAD_STATUS_OPTIONS } from "@/constants/leadStatus";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const STATUS_FILTER_OPTIONS = [
  { label: "leadPage.filter.allStatuses", value: "" },
  ...LEAD_STATUS_OPTIONS,
];

const getColumns = (
  sources: SourceI[],
  employees: EmployeeI[],
  classes: ClasseI[],
  t: TFunction,
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
            <span>{t("leadPage.enrolled")}</span>
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
            title={t("common.button.edit")}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => onActionDelete(l)}
            className="text-crm-label-text hover:text-crm-danger cursor-pointer rounded p-1 transition hover:bg-slate-100"
            title={t("common.button.delete")}
          >
            <TrashIcon />
          </button>
        </div>
      );
    },
  },
];

export default function PreSale() {
  const { t } = useTranslation();
  const { page, limit, onPageChange, onLimitChange } = usePagination(10);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [sourceId, setSourceId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim());

  const [appliedSearch, setAppliedSearch] = useState(search);
  if (search !== appliedSearch) {
    setAppliedSearch(search);
    onPageChange(1);
  }

  const { data: leadData, refetch } = useFetchData(
    () =>
      getLeads(page, limit, {
        status: status || undefined,
        sourceId: sourceId ? Number(sourceId) : undefined,
        sellerId: sellerId ? Number(sellerId) : undefined,
        search: search || undefined,
      }),
    [page, limit, status, sourceId, sellerId, search],
  );
  const { data: lookups } = useFetchData(
    {
      sources: () => getSources(),
      employees: () => getEmployees(),
      classes: () => getClasses(),
    },
    [],
  );

  const leads = useMemo(() => leadData?.items || [], [leadData?.items]);
  const total = leadData?.total ?? 0;
  const sources = useMemo(
    () => lookups?.sources.items || [],
    [lookups?.sources.items],
  );
  const employees = useMemo(
    () => lookups?.employees.items || [],
    [lookups?.employees.items],
  );
  const classes = useMemo(
    () => lookups?.classes.items.filter((c) => c.status !== "closed") || [],
    [lookups?.classes.items],
  );

  const handleStatusChange = (value: string) => {
    setStatus(value as LeadStatus | "");
    onPageChange(1);
  };
  const handleSourceChange = (value: string) => {
    setSourceId(value);
    onPageChange(1);
  };
  const handleSellerChange = (value: string) => {
    setSellerId(value);
    onPageChange(1);
  };
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
        t,
        (row) => actions.handleOpenEdit(leads, row),
        (row) => actions.handleOpenDelete(row),
      ),
    [sources, employees, classes, t, actions, leads],
  );

  const sellers = useMemo(
    () => employees?.filter((e) => e.role === "sale"),
    [employees],
  );

  const sourceFilterOptions = useMemo(
    () => [
      { label: "leadPage.filter.allSources", value: "" },
      ...sources.map((src) => ({ label: src.name, value: String(src.id) })),
    ],
    [sources],
  );
  const sellerFilterOptions = useMemo(
    () => [
      { label: "leadPage.filter.allSellers", value: "" },
      ...sellers.map((e) => ({
        label: e.fullName || `#${e.id}`,
        value: String(e.id),
      })),
    ],
    [sellers],
  );

  return (
    <>
      <div>
        <CardBase className="flex flex-wrap items-center gap-4">
          <div className="min-w-64 flex-1">
            <InputField
              id="leadSearch"
              name="leadSearch"
              label=""
              icon={<SearchIcon size="sm" />}
              placeholder="leadPage.filter.searchPlaceholder"
              autoComplete="off"
              maxLength={100}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="w-52">
            <SelectField
              id="sourceFilter"
              name="sourceFilter"
              label=""
              options={sourceFilterOptions}
              value={sourceId}
              onChange={(e) => handleSourceChange(e.target.value)}
            />
          </div>
          <div className="w-52">
            <SelectField
              id="sellerFilter"
              name="sellerFilter"
              label=""
              options={sellerFilterOptions}
              value={sellerId}
              onChange={(e) => handleSellerChange(e.target.value)}
            />
          </div>
          <div className="w-52">
            <SelectField
              id="statusFilter"
              name="statusFilter"
              label=""
              options={STATUS_FILTER_OPTIONS}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <Button
              buttonTitle="common.button.addLead"
              gradient
              leftIcon={<PlusIcon size="sm" />}
              onClick={actions.handleOpenCreate}
            />
          </div>
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

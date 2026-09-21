import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { InputField, SelectField } from "@/components/Form";
import {
  AddClassDialog,
  ConfirmDeleteDialog,
  EnrolledClassesDialog,
  LeadDialog,
} from "@/components/Dialogs";
import {
  EditIcon,
  GraduationCapIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/Icons";
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
import { buildSelectOptions } from "@/utils/helper";
import { formatCurrency } from "@/utils/format";
import { getLeadEnrolledClasses } from "@/utils/enrollment";

const STATUS_FILTER_OPTIONS = [
  { label: "leadPage.filter.allStatuses", value: "" },
  ...LEAD_STATUS_OPTIONS,
];

const MAX_INLINE_CLASSES = 2;

const getColumns = (
  sources: SourceI[],
  employees: EmployeeI[],
  classes: ClasseI[],
  t: TFunction,
  onActionEdit: (row: LeadI) => void,
  onActionDelete: (row: LeadI) => void,
  onActionAddClass: (row: LeadI) => void,
  onActionViewClasses: (row: LeadI) => void,
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
    render: (l) => {
      const enrolled = getLeadEnrolledClasses(l);

      if (enrolled.length === 0) {
        return <span className="text-crm-danger font-medium">-</span>;
      }

      if (enrolled.length > MAX_INLINE_CLASSES) {
        return (
          <button
            type="button"
            onClick={() => onActionViewClasses(l)}
            title={t("leadPage.classList.viewDetail")}
            className="text-crm-accent border-crm-border hover:bg-crm-menu-item-bg-hover inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition"
          >
            <GraduationCapIcon size="xs" />
            {t("leadPage.classList.count", { num: enrolled.length })}
          </button>
        );
      }

      return (
        <div className="flex flex-col gap-0.5">
          {enrolled.map(({ classId }) => (
            <span key={classId} className="text-crm-accent font-medium">
              {classes.find((c) => c.id === classId)?.name ?? `#${classId}`}
            </span>
          ))}
        </div>
      );
    },
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
      if (l.status === "lost") {
        return <span className="text-crm-danger text-xs">-----</span>;
      }

      return (
        <div className="flex items-center gap-1">
          {l.status === "converted" ? (
            <Button
              small
              leftIcon={<PlusIcon />}
              className="text-crm-label-text hover:text-crm-primary w-fit cursor-pointer rounded p-1! transition hover:bg-slate-100"
              onClick={() => onActionAddClass(l)}
              title={t("common.button.addClass")}
            />
          ) : (
            <Button
              small
              leftIcon={<EditIcon />}
              className="text-crm-label-text hover:text-crm-info w-fit cursor-pointer rounded p-1! transition hover:bg-slate-100"
              onClick={() => onActionEdit(l)}
              title={t("common.button.edit")}
            />
          )}
          <Button
            small
            leftIcon={<TrashIcon />}
            className="text-crm-label-text hover:text-crm-danger cursor-pointer rounded p-1! transition hover:bg-slate-100"
            onClick={() => onActionDelete(l)}
            title={t("common.button.delete")}
          />
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
  const allClasses = useMemo(
    () => lookups?.classes.items || [],
    [lookups?.classes.items],
  );
  const classes = useMemo(
    () => allClasses.filter((c) => c.status !== "closed"),
    [allClasses],
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
  const [addClassLead, setAddClassLead] = useState<LeadI | null>(null);
  const [viewClassesLead, setViewClassesLead] = useState<LeadI | null>(null);
  const actions = useTableActions<LeadI>(
    refetch,
    deleteLead as (id: string | number) => Promise<void>,
  );

  const columns = useMemo(
    () =>
      getColumns(
        sources,
        employees,
        allClasses,
        t,
        (row) => actions.handleOpenEdit(leads, row),
        (row) => actions.handleOpenDelete(row),
        (row) => setAddClassLead(row),
        (row) => setViewClassesLead(row),
      ),
    [sources, employees, allClasses, t, actions, leads],
  );

  const sellers = useMemo(
    () => employees?.filter((e) => e.role === "sale"),
    [employees],
  );

  const sourceFilterOptions = useMemo(
    () =>
      buildSelectOptions(sources, (s) => s.name, "leadPage.filter.allSources"),
    [sources],
  );

  const sellerFilterOptions = useMemo(
    () =>
      buildSelectOptions(
        sellers,
        (s) => s.fullName || `#${s.id}`,
        "leadPage.filter.allSellers",
      ),
    [sellers],
  );

  const sourceOptions = useMemo(
    () =>
      buildSelectOptions(sources, (s) => s.name, "leadPage.form.selectSource"),
    [sources],
  );

  const sellerOptions = useMemo(
    () =>
      buildSelectOptions(
        sellers,
        (s) => s.fullName || `Sales #${s.id}`,
        "leadPage.form.selectSales",
      ),
    [sellers],
  );

  const classeOptions = useMemo(
    () =>
      buildSelectOptions(
        classes,
        (c) => `${c.name} - ${formatCurrency(c.tuition)}`,
        "leadPage.form.selectClasse",
      ),
    [classes],
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
            sourceOptions={sourceOptions}
            sellerOptions={sellerOptions}
            classeOptions={classeOptions}
          />
          {addClassLead && (
            <AddClassDialog
              isOpen
              lead={addClassLead}
              classes={allClasses}
              onClose={() => setAddClassLead(null)}
              onSuccess={refetch}
            />
          )}
          {viewClassesLead && (
            <EnrolledClassesDialog
              isOpen
              lead={viewClassesLead}
              classes={allClasses}
              onClose={() => setViewClassesLead(null)}
              onAddClass={(lead) => {
                setViewClassesLead(null);
                setAddClassLead(lead);
              }}
            />
          )}
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

import { useMemo } from "react";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { ConfirmDeleteDialog, EmployeeDialog } from "@/components/Dialogs";
import { UserPlusIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteEmployee, getEmployees } from "@/services/employee";
import { formatCurrency } from "@/utils/format";
import type { EmployeeI, EmployeeRole } from "@/types/database";
import type { ColumnI } from "@/types/table";
import { StatusBadge } from "@/components/ui";

const EMPLOYEE_ROLE = {
  trainer: { label: "empPage.roles.sale", color: "var(--crm-primary)" },
  sale: {
    label: "empPage.roles.trainer",
    color: "var(--crm-primary)",
  },
  assistant: {
    label: "empPage.roles.assistant",
    color: "var(--crm-primary)",
  },
  manager: {
    label: "empPage.roles.manager",
    color: "var(--crm-primary)",
  },
  admin: { label: "empPage.roles.admin", color: "var(--crm-primary)" },
};

const getColumns = (): ColumnI<EmployeeI>[] => [
  {
    value: "id",
    text: "common.tableHeader.employeeCode",
    render: (e) => (
      <span className="text-crm-label-text font-mono font-bold">EMP{e.id}</span>
    ),
  },
  {
    value: "fullName",
    text: "common.tableHeader.fullName",
    className: "font-bold text-crm-heading-text text-[16px]",
  },
  {
    value: "role",
    text: "common.tableHeader.role",
    render: (l: EmployeeI) => {
      const status = EMPLOYEE_ROLE[l.role as EmployeeRole];
      return <StatusBadge label={status.label} color={status.color} />;
    },
  },
  { value: "phone", text: "common.tableHeader.phone", className: "font-mono" },
  {
    value: "salary",
    text: "common.tableHeader.baseSalary",
    render: (e) => (
      <span className="text-crm-heading-text text-[16px] font-medium">
        {formatCurrency(e.salary)}
      </span>
    ),
  },
  {
    value: "commissionRate",
    text: "common.tableHeader.commissionRate",
    className: "text-crm-accent font-bold",
  },
  { value: "actions", text: "common.tableHeader.actions" },
];

export default function Employee() {
  const { data: employees, refetch } = useFetchData(
    () => getEmployees() as Promise<EmployeeI[]>,
    [],
  );

  const actions = useTableActions<EmployeeI>(
    refetch,
    deleteEmployee as (id: string | number) => Promise<void>,
  );

  const columns = useMemo(() => getColumns(), []);

  return (
    <>
      <div>
        <CardBase
          title="common.cardTitle.employeeList"
          desc="common.cardDesc.staffManagement"
          className="flex items-center justify-between"
        >
          <Button
            buttonTitle="common.button.addEmployee"
            gradient
            leftIcon={<UserPlusIcon />}
            onClick={actions.handleOpenCreate}
          />
        </CardBase>
      </div>
      <div>
        <CardBase>
          <Table<EmployeeI>
            columns={columns}
            rows={employees || []}
            height="max-h-[calc(100vh-260px)]"
            onEdit={(row) => actions.handleOpenEdit(employees || [], row)}
            onDelete={actions.handleOpenDelete}
          />
        </CardBase>
        <EmployeeDialog
          isOpen={actions.isFormOpen}
          onClose={actions.handleCloseForm}
          onSuccess={refetch}
          initialData={actions.selectedItem}
        />
        <ConfirmDeleteDialog
          isOpen={actions.isDeleteOpen}
          loading={actions.deleteLoading}
          onClose={actions.handleCloseDelete}
          onConfirm={actions.handleConfirmDelete}
        />
      </div>
    </>
  );
}

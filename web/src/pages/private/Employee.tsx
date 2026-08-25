import { useMemo } from "react";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { ConfirmDeleteDialog, EmployeeDialog } from "@/components/Dialogs";
import type { EmployeeI } from "@/components/Dialogs/EmployeeDialog";
import { UserPlusIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteEmployee, getEmployees } from "@/services/employee";
import { formatCurrency } from "@/utils/format";

const COLUMNS = [
  { value: "employeeCode", text: "common.tableHeader.employeeCode" },
  { value: "fullName", text: "common.tableHeader.fullName" },
  { value: "position", text: "common.tableHeader.position" },
  { value: "phone", text: "common.tableHeader.phone" },
  { value: "salary", text: "common.tableHeader.baseSalary" },
  { value: "commissionRate", text: "common.tableHeader.commissionRate" },
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

  const rows = useMemo(() => {
    if (!employees) return [];
    return employees.map((e) => ({
      employeeCode: e.id,
      fullName: `${e.firstName} ${e.lastName}`,
      ...e,
      salary: formatCurrency(e.salary, "VNĐ"),
    }));
  }, [employees]);

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
          <EmployeeDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
            initialData={actions.selectedItem}
          />
        </CardBase>
      </div>
      <div>
        <CardBase>
          <Table
            columns={COLUMNS}
            rows={rows}
            onEdit={(row) => actions.handleOpenEdit(employees || [], row)}
            onDelete={actions.handleOpenDelete}
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

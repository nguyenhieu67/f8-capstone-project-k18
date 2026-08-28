import Button from "@/components/Button";
import { CardBase, ClassCard } from "@/components/Card";
import { ClassDialog, ConfirmDeleteDialog } from "@/components/Dialogs";
import { PlusIcon } from "@/components/Icons";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteClasse, getClasses } from "@/services/classe";
import { getEmployees } from "@/services/employee";
import type { ClasseI, EmployeeI } from "@/types/database";
import { useMemo } from "react";

export default function Classe() {
  const { data, refetch } = useFetchData(
    {
      classes: () => getClasses() as Promise<ClasseI[]>,
      employees: () => getEmployees() as Promise<EmployeeI[]>,
    },
    [],
  );
  const classes = data?.classes || [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const employees = data?.employees || [];

  const actions = useTableActions<ClasseI>(
    refetch,
    deleteClasse as (id: string | number) => Promise<void>,
  );
  const trainers = useMemo(
    () => employees?.filter((e) => e.role === "trainer"),
    [employees],
  );

  return (
    <>
      <div>
        <CardBase
          title="common.cardTitle.courseAndClassManagement"
          desc="common.cardDesc.openedClasses"
          className="flex items-center justify-between"
        >
          <Button
            buttonTitle="common.button.addClass"
            gradient
            leftIcon={<PlusIcon size="sm" />}
            onClick={actions.handleOpenCreate}
          />
        </CardBase>
      </div>
      <div className="max-h-[calc(100vh-240px)] scrollbar-thin overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classes?.map((classe) => {
            const trainer = trainers?.find(
              (t) => t.id === Number(classe.trainerId),
            );
            return (
              <ClassCard
                key={classe.id}
                code={classe.code}
                name={classe.name}
                status={classe.status}
                schedule={classe.schedule}
                trainer={trainer?.fullName || ""}
                tuition={classe.tuition}
                onClick={() => actions.handleOpenEdit(classes, classe)}
              />
            );
          })}
          <ClassDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
            initialData={actions.selectedItem}
            trainers={trainers}
            onDelete={
              actions.selectedItem
                ? () => actions.handleOpenDelete(actions.selectedItem!)
                : undefined
            }
          />

          <ConfirmDeleteDialog
            isOpen={actions.isDeleteOpen}
            loading={actions.deleteLoading}
            onClose={actions.handleCloseDelete}
            onConfirm={actions.handleConfirmDelete}
          />
        </div>
      </div>
    </>
  );
}

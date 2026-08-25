import Button from "@/components/Button";
import { CardBase, ClassCard } from "@/components/Card";
import { ClassDialog, ConfirmDeleteDialog } from "@/components/Dialogs";
import type { ClasseI } from "@/components/Dialogs/ClassDialog";
import type { EmployeeI } from "@/components/Dialogs/EmployeeDialog";
import { PlusIcon } from "@/components/Icons";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteClasse, getClasses } from "@/services/classe";
import { getEmployees } from "@/services/employee";
import { useMemo } from "react";

export default function Classe() {
  const { data: classes, refetch } = useFetchData(
    () => getClasses() as Promise<ClasseI[]>,
    [],
  );
  const { data: employees } = useFetchData(
    () => getEmployees() as Promise<EmployeeI[]>,
    [],
  );

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
      <div className="h-192 scrollbar-thin overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classes?.map((classe) => {
            const trainer = trainers?.find(
              (t) => t.id === Number(classe.trainerId),
            );

            const fullname = `${trainer?.firstName} ${trainer?.lastName}`;
            return (
              <ClassCard
                key={classe.id}
                code={classe.code}
                name={classe.name}
                status={classe.status}
                schedule={classe.schedule}
                trainer={fullname}
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

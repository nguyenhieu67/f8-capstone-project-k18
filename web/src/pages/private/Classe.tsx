import Button from "@/components/Button";
import { CardBase, ClassCard } from "@/components/Card";
import { ClassDialog, ConfirmDeleteDialog } from "@/components/Dialogs";
import { PlusIcon } from "@/components/Icons";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteClasse, getClasses } from "@/services/classe";
import { getEmployees } from "@/services/employee";
import { getStudentClasses } from "@/services/students";
import type { ClasseI } from "@/types/database";
import { buildSelectOptions } from "@/utils/helper";
import { useMemo } from "react";

export default function Classe() {
  const { data, refetch } = useFetchData(
    {
      classes: () => getClasses(),
      employees: () => getEmployees(),
      studentClasses: () => getStudentClasses(),
    },
    [],
  );
  const actions = useTableActions<ClasseI>(
    refetch,
    deleteClasse as (id: string | number) => Promise<void>,
  );

  const classes = useMemo(
    () => data?.classes.items || [],
    [data?.classes.items],
  );
  const employees = useMemo(
    () => data?.employees.items || [],
    [data?.employees.items],
  );
  const studentClasses = useMemo(
    () => data?.studentClasses.items || [],
    [data?.studentClasses.items],
  );
  const trainers = useMemo(
    () => employees?.filter((e) => e.role === "trainer"),
    [employees],
  );

  const trainerOptions = useMemo(
    () =>
      buildSelectOptions(
        trainers,
        (t) => t.fullName || `Trainer #${t.id}`,
        "classPage.filter.selectTrainer",
      ),
    [trainers],
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
      <div className="max-h-[calc(100vh-230px)] scrollbar-thin overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classes?.map((classe) => {
            const trainer = trainers?.find(
              (t) => t.id === Number(classe.trainerId),
            );
            const totalStudent = studentClasses.filter(
              (sc) => Number(sc.classId) === Number(classe.id),
            ).length;
            return (
              <ClassCard
                key={classe.id}
                code={classe.code}
                name={classe.name}
                status={classe.status}
                schedule={classe.schedule}
                trainer={trainer?.fullName || ""}
                tuition={classe.tuition}
                totalStudents={totalStudent}
                onClick={() => actions.handleOpenEdit(classes, classe)}
              />
            );
          })}
          <ClassDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
            initialData={actions.selectedItem}
            trainerOptions={trainerOptions}
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

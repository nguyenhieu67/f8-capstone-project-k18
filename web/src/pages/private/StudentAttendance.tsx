import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { SelectField } from "@/components/Form";
import { SaveIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { useAppToast, useAttendanceSave, useFetchData } from "@/hooks";
import { getClasses } from "@/services/classe";
import { getLeads } from "@/services/lead";
import {
  getStudentAttendances,
  getStudentClasses,
  getStudents,
  saveStudentAttendance,
} from "@/services/students";
import type {
  ClasseI,
  LeadI,
  StudentAttendanceI,
  StudentClasseI,
  StudentI,
} from "@/types/database";
import { formatCurrency } from "@/utils/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type AttendanceStatus = "present" | "absent";

interface AttendanceEntry {
  status: AttendanceStatus;
  note: string;
}

type AttendanceMap = Record<number, AttendanceEntry>;

const DEFAULT_ENTRY: AttendanceEntry = { status: "present", note: "" };

interface GetColumnsParams {
  students: StudentI[];
  leads: LeadI[];
  classes: ClasseI[];
  rows: StudentClasseI[];
  attendance: AttendanceMap;
  t: (text: string) => string;
  onAttendanceChange: <K extends keyof AttendanceEntry>(
    studentClasseId: number,
    field: K,
    value: AttendanceEntry[K],
  ) => void;
}

const getColumns = ({
  students,
  leads,
  classes,
  rows,
  attendance,
  t,
  onAttendanceChange,
}: GetColumnsParams) => {
  const getLeadOf = (sc: StudentClasseI) => {
    const student = students.find((s) => s.id === Number(sc.studentId));
    const classe = classes.find((c) => c.id === Number(sc.classId));
    if (!student || !classe) return undefined;
    return leads.find(
      (l) =>
        l.id === Number(student.leadId) && Number(l.classeId) === classe.id,
    );
  };

  return [
    {
      value: "stt",
      text: "common.tableHeader.stt",
      render: (sc: StudentClasseI) => {
        const index = rows.findIndex((item) => item.id === sc.id);
        return <span className="text-slate-500">{index + 1}</span>;
      },
    },
    {
      value: "fullName",
      text: "common.tableHeader.fullName",
      render: (sr: StudentClasseI) => {
        const lead = getLeadOf(sr);
        return (
          <span className="text-crm-heading-text text-[16px] font-bold">
            {lead?.fullName ?? ""}
          </span>
        );
      },
    },
    {
      value: "phone",
      text: "common.tableHeader.phone",
      render: (sc: StudentClasseI) => (
        <span className="text-crm-info font-mono">
          {getLeadOf(sc)?.phone ?? ""}
        </span>
      ),
    },
    {
      value: "attendanceStatus",
      text: "common.tableHeader.attendanceStatus",
      render: (sc: StudentClasseI) => {
        const studentClasseId = Number(sc.id);
        const entry = attendance[studentClasseId] ?? DEFAULT_ENTRY;
        return (
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <label
              className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium ${
                entry.status === "present"
                  ? "bg-crm-success text-white"
                  : "text-slate-600"
              }`}
            >
              <input
                type="radio"
                name={`att-${sc.id}`}
                value="present"
                checked={entry.status === "present"}
                onChange={() =>
                  onAttendanceChange(studentClasseId, "status", "present")
                }
                className="hidden"
              />
              {t("studentClassePage.status.present")}
            </label>
            <label
              className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium ${
                entry.status === "absent"
                  ? "bg-crm-danger text-white"
                  : "text-slate-600"
              }`}
            >
              <input
                type="radio"
                name={`att-${sc.id}`}
                value="absent"
                checked={entry.status === "absent"}
                onChange={() =>
                  onAttendanceChange(studentClasseId, "status", "absent")
                }
                className="hidden"
              />
              {t("studentClassePage.status.absent")}
            </label>
          </div>
        );
      },
    },
    {
      value: "notes",
      text: "common.tableHeader.notes",
      render: (sc: StudentClasseI) => {
        const studentClasseId = Number(sc.id);
        const entry = attendance[studentClasseId] ?? DEFAULT_ENTRY;
        return (
          <input
            type="text"
            value={entry.note}
            onChange={(e) =>
              onAttendanceChange(studentClasseId, "note", e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-none"
            placeholder={t("studentClassePage.notePlaceholder")}
          />
        );
      },
    },
  ];
};

export default function StudentAttendance() {
  const { t } = useTranslation();
  const toastMsg = useAppToast();
  const { data, refetch } = useFetchData(
    {
      studentClasses: () => getStudentClasses() as Promise<StudentClasseI[]>,
      students: () => getStudents() as Promise<StudentI[]>,
      studentAtts: () =>
        getStudentAttendances() as Promise<StudentAttendanceI[]>,
      leads: () => getLeads() as Promise<LeadI[]>,
      classes: () => getClasses() as Promise<ClasseI[]>,
    },
    [],
  );

  const studentClasses = useMemo(
    () => data?.studentClasses || [],
    [data?.studentClasses],
  );
  const students = useMemo(() => data?.students || [], [data?.students]);
  const studentAtts = useMemo(
    () => data?.studentAtts || [],
    [data?.studentAtts],
  );
  const leads = useMemo(() => data?.leads || [], [data?.leads]);
  const classes = useMemo(() => data?.classes || [], [data?.classes]);

  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(
    undefined,
  );
  const [attendanceDate, setAttendanceDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [attendance, setAttendance] = useState<AttendanceMap>({});

  useEffect(() => {
    if (selectedClassId === undefined && classes.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const selectedClasse = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId],
  );

  const filteredStudentClasses = useMemo(
    () =>
      studentClasses.filter(
        (sc) => Number(sc.classId) === Number(selectedClassId),
      ),
    [studentClasses, selectedClassId],
  );

  const { handleSave, markDirty, setHasExistingRecords, setDirtyIds } =
    useAttendanceSave({
      items: filteredStudentClasses,
      getItemId: (sc) => Number(sc.id),
      buildRecord: (sc) => ({
        studentId: Number(sc.studentId),
        classId: Number(selectedClassId),
        date: attendanceDate,
        status: attendance[Number(sc.id)]?.status ?? "present",
        note: attendance[Number(sc.id)]?.note ?? "",
      }),
      saveFn: saveStudentAttendance,
      onSuccess: refetch,
      toastMsg,
    });

  useEffect(() => {
    if (!selectedClassId || filteredStudentClasses.length === 0) return;

    const newMap: AttendanceMap = {};
    let hasRecords = false;

    filteredStudentClasses.forEach((sc) => {
      const studentClasseId = Number(sc.id);

      const existingRecord = studentAtts.find(
        (sa) =>
          Number(sa.classId) === Number(selectedClassId) &&
          Number(sa.studentId) === Number(sc.studentId) &&
          sa.date === attendanceDate,
      );

      if (existingRecord) {
        hasRecords = true;
        newMap[studentClasseId] = {
          status: existingRecord.status || "present",
          note: existingRecord.note || "",
        };
      } else {
        newMap[studentClasseId] = { ...DEFAULT_ENTRY };
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendance(newMap);
    setHasExistingRecords(hasRecords);
    setDirtyIds(new Set());
  }, [
    selectedClassId,
    attendanceDate,
    filteredStudentClasses,
    studentAtts,
    setHasExistingRecords,
    setDirtyIds,
  ]);

  const handleAttendanceChange = useCallback(
    <K extends keyof AttendanceEntry>(
      studentClasseId: number,
      field: K,
      value: AttendanceEntry[K],
    ) => {
      setAttendance((prev) => ({
        ...prev,
        [studentClasseId]: {
          ...(prev[studentClasseId] ?? DEFAULT_ENTRY),
          [field]: value,
        },
      }));
      markDirty(studentClasseId);
    },
    [markDirty],
  );

  const columns = useMemo(
    () =>
      getColumns({
        students,
        leads,
        classes,
        rows: filteredStudentClasses,
        attendance,
        t,
        onAttendanceChange: handleAttendanceChange,
      }),
    [
      students,
      leads,
      classes,
      filteredStudentClasses,
      attendance,
      t,
      handleAttendanceChange,
    ],
  );

  const classeOptions = [
    ...classes.map((c) => {
      return {
        label: `(${c.code}) ${c.name} - ${formatCurrency(c.tuition, "VNĐ")}`,
        value: String(c.id),
      };
    }),
  ];

  return (
    <>
      <CardBase>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex min-w-65 flex-1 items-center gap-3">
            <span className="text-crm-label-text text-sm font-semibold">
              {t("studentClassePage.selectClass")}
            </span>
            <SelectField
              id="classe"
              name="classe"
              label=""
              options={classeOptions}
              value={String(selectedClassId ?? "")}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center">
            <label className="text-crm-label-text mr-2 mb-1 block text-sm font-medium">
              {t("studentClassePage.attendanceDate")}
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="rounded-xl border border-slate-200 p-2.5 text-sm focus:outline-none"
            />
          </div>
          <Button
            buttonTitle="common.button.saveAttendance"
            success
            leftIcon={<SaveIcon />}
            onClick={handleSave}
          />
        </div>
      </CardBase>

      <CardBase
        title="common.cardTitle.classAttendance"
        dblTitle={
          selectedClasse
            ? `: (${selectedClasse.code}) ${selectedClasse.name}`
            : ""
        }
      >
        <div className="mt-4">
          <Table
            columns={columns}
            rows={filteredStudentClasses}
            emptyMessage="studentClassePage.emptyStudents"
            height="max-h-[calc(100vh-340px)]"
          />
        </div>
      </CardBase>
    </>
  );
}

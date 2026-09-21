import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { SelectField } from "@/components/Form";
import { SaveIcon } from "@/components/Icons";
import Table from "@/components/Table";
import { useAppToast, useAttendanceSave, useFetchData } from "@/hooks";
import { getClasses } from "@/services/classe";
import { getClassAttendance } from "@/services/classAttendance";
import { saveStudentAttendance } from "@/services/students";
import type {
  ClassAttendanceRowI,
  ClassAttendanceStatus,
} from "@/types/classAttendance";
import type { ColumnI } from "@/types/table";
import { formatCurrency, toLocalDateString } from "@/utils/format";

interface AttendanceEntry {
  status: ClassAttendanceStatus;
  note: string;
}

type AttendanceMap = Record<number, AttendanceEntry>;

const DEFAULT_ENTRY: AttendanceEntry = { status: "present", note: "" };

interface GetColumnsParams {
  rows: ClassAttendanceRowI[];
  attendance: AttendanceMap;
  isEditable: boolean;
  t: (text: string) => string;
  onAttendanceChange: <K extends keyof AttendanceEntry>(
    studentClasseId: number,
    field: K,
    value: AttendanceEntry[K],
  ) => void;
}

const getColumns = ({
  rows,
  attendance,
  isEditable,
  t,
  onAttendanceChange,
}: GetColumnsParams): ColumnI<ClassAttendanceRowI>[] => [
  {
    value: "stt",
    text: "common.tableHeader.stt",
    render: (r) => (
      <span className="text-slate-500">{rows.indexOf(r) + 1}</span>
    ),
  },
  {
    value: "fullName",
    text: "common.tableHeader.fullName",
    render: (r) => (
      <span className="text-crm-heading-text text-[16px] font-bold">
        {r.fullName}
      </span>
    ),
  },
  {
    value: "phone",
    text: "common.tableHeader.phone",
    render: (r) => (
      <span className="text-crm-info font-mono">{r.phone ?? ""}</span>
    ),
  },
  {
    value: "attendanceStatus",
    text: "common.tableHeader.attendanceStatus",
    render: (r) => {
      const entry = attendance[r.id] ?? DEFAULT_ENTRY;
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
              name={`att-${r.id}`}
              value="present"
              checked={entry.status === "present"}
              disabled={!isEditable}
              className="hidden"
              onChange={() => onAttendanceChange(r.id, "status", "present")}
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
              name={`att-${r.id}`}
              value="absent"
              checked={entry.status === "absent"}
              disabled={!isEditable}
              className="hidden"
              onChange={() => onAttendanceChange(r.id, "status", "absent")}
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
    render: (r) => {
      const entry = attendance[r.id] ?? DEFAULT_ENTRY;
      return (
        <input
          type="text"
          value={entry.note}
          onChange={(e) => onAttendanceChange(r.id, "note", e.target.value)}
          className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-none"
          placeholder={t("studentClassePage.notePlaceholder")}
        />
      );
    },
  },
];

export default function StudentAttendance() {
  const { t } = useTranslation();
  const toastMsg = useAppToast();
  const [pickedClassId, setPickedClassId] = useState<number | undefined>();
  const [attendanceDate, setAttendanceDate] = useState<string>(() =>
    toLocalDateString(),
  );
  const [attendance, setAttendance] = useState<AttendanceMap>({});

  const { data: classData } = useFetchData(() => getClasses(), []);
  const classes = useMemo(
    () => (classData?.items ?? []).filter((c) => c.status !== "closed"),
    [classData?.items],
  );

  const selectedClassId = pickedClassId ?? classes[0]?.id;
  const selectedClasse = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId],
  );

  const isEditable = selectedClasse?.status === "ongoing";

  const { data: roster, refetch } = useFetchData(
    () =>
      selectedClassId
        ? getClassAttendance(selectedClassId, attendanceDate)
        : Promise.resolve(null),
    [selectedClassId, attendanceDate],
  );

  const isCurrent =
    roster?.classId === selectedClassId && roster?.date === attendanceDate;
  const rows = useMemo(
    () => (isCurrent && roster ? roster.items : []),
    [isCurrent, roster],
  );

  const { handleSave, markDirty, setHasExistingRecords, setDirtyIds } =
    useAttendanceSave({
      items: rows,
      getItemId: (row) => row.id,
      buildRecord: (row) => ({
        studentId: row.studentId,
        classId: Number(selectedClassId),
        date: attendanceDate,
        status: attendance[row.id]?.status ?? "present",
        note: attendance[row.id]?.note ?? "",
      }),
      saveFn: saveStudentAttendance,
      onSuccess: refetch,
      toastMsg,
    });

  useEffect(() => {
    if (!isCurrent || !roster) return;

    const newMap: AttendanceMap = {};
    roster.items.forEach((row) => {
      newMap[row.id] = row.status
        ? { status: row.status, note: row.note ?? "" }
        : { ...DEFAULT_ENTRY };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendance(newMap);
    setHasExistingRecords(roster.hasRecords);
    setDirtyIds(new Set());
  }, [isCurrent, roster, setHasExistingRecords, setDirtyIds]);

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
        rows,
        attendance,
        isEditable,
        t,
        onAttendanceChange: handleAttendanceChange,
      }),
    [rows, attendance, isEditable, t, handleAttendanceChange],
  );

  const classeOptions = useMemo(
    () =>
      classes.map((c) => ({
        label: `(${c.code}) ${c.name} - ${formatCurrency(c.tuition, "VNĐ")}`,
        value: String(c.id),
      })),
    [classes],
  );

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
              onChange={(e) => setPickedClassId(Number(e.target.value))}
            />
          </div>
          {isEditable && (
            <>
              <div className="flex items-center">
                <label className="text-crm-label-text mr-2 mb-1 block text-sm font-medium">
                  {t("studentClassePage.attendanceDate")}
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) =>
                    e.target.value && setAttendanceDate(e.target.value)
                  }
                  className="rounded-xl border border-slate-200 p-2.5 text-sm focus:outline-none"
                />
              </div>
              <Button
                buttonTitle="common.button.saveAttendance"
                success
                leftIcon={<SaveIcon />}
                onClick={handleSave}
              />
            </>
          )}
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
          <Table<ClassAttendanceRowI>
            columns={columns}
            rows={rows}
            emptyMessage="studentClassePage.emptyStudents"
            height="max-h-[calc(100vh-310px)]"
          />
        </div>
      </CardBase>
    </>
  );
}

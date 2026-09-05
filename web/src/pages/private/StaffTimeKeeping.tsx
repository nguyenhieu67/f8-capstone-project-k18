import { useState, useMemo, useEffect, useCallback } from "react";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import Table from "@/components/Table";
import { InputField, SelectField } from "@/components/Form";
import { CheckDoubleIcon } from "@/components/Icons";
import { useFetchData } from "@/hooks";
import { getEmployees } from "@/services/employee";
import {
  getStaffAttendanceByDate,
  saveStaffAttendance,
} from "@/services/employee";
import type { EmployeeI, EmployeeRole } from "@/types/database";
import type { ColumnI } from "@/types/table";
import { EMPLOYEE_ROLE } from "@/constants/employeeRole";
import { StatusBadge } from "@/components/ui";

export type AttendanceStatus = "present" | "late" | "absent" | "leave";

export interface AttendanceRecordI {
  employeeId: number;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  note?: string | null;
}

const STATUS_OPTIONS = [
  { label: "staffTimeKeepingPage.status.present", value: "present" },
  { label: "staffTimeKeepingPage.status.late", value: "late" },
  { label: "staffTimeKeepingPage.status.absent", value: "absent" },
  { label: "staffTimeKeepingPage.status.leave", value: "leave" },
];

const isOffStatus = (status: AttendanceStatus) =>
  status === "absent" || status === "leave";

export default function StaffAttendance() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const { data: employees } = useFetchData(
    () => getEmployees() as Promise<EmployeeI[]>,
    [],
  );

  const [attendanceMap, setAttendanceMap] = useState<
    Record<number, AttendanceRecordI>
  >({});

  const [hasExistingRecords, setHasExistingRecords] = useState<boolean>(false);

  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!employees || employees.length === 0) return;

    async function fetchAttendance() {
      try {
        const records = (await getStaffAttendanceByDate(selectedDate)) as
          AttendanceRecordI[] | undefined;

        const map: Record<number, AttendanceRecordI> = {};

        employees?.forEach((emp) => {
          if (!emp.id) return;
          const existing = records?.find(
            (r: AttendanceRecordI) => Number(r.employeeId) === emp.id,
          );

          map[emp.id] = existing ?? {
            employeeId: emp.id,
            date: selectedDate,
            status: "present",
            checkInTime: "08:00",
            note: "",
          };
        });

        setAttendanceMap(map);
        setHasExistingRecords(Boolean(records && records.length > 0));
        setDirtyIds(new Set());
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    }

    fetchAttendance();
  }, [selectedDate, employees]);

  const handleRecordChange = useCallback(
    (
      employeeId: number,
      field: keyof Omit<AttendanceRecordI, "employeeId" | "date">,
      value: string,
    ) => {
      setAttendanceMap((prev) => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          employeeId,
          date: selectedDate,
          [field]: value,
        },
      }));

      setDirtyIds((prev) => {
        const next = new Set(prev);
        next.add(employeeId);
        return next;
      });
    },
    [selectedDate],
  );

  // Build payload cho 1 nhân viên — bỏ checkInTime nếu status là absent/leave
  const buildRecord = useCallback(
    (employeeId: number): AttendanceRecordI => {
      const currentData = attendanceMap[employeeId];
      const status: AttendanceStatus = currentData?.status || "present";

      const record: AttendanceRecordI = {
        employeeId,
        date: selectedDate,
        status,
        note: currentData.note || "",
      };

      if (!isOffStatus(status)) {
        record.checkInTime = currentData?.checkInTime || "08:00";
      } else {
        record.checkInTime = null;
      }

      return record;
    },
    [attendanceMap, selectedDate],
  );

  const handleSave = async () => {
    if (!employees || employees.length === 0) return;

    try {
      const employeeIds = employees
        .filter((emp): emp is EmployeeI & { id: number } => Boolean(emp.id))
        .map((emp) => emp.id);

      if (!hasExistingRecords) {
        const recordsToCreate = employeeIds.map((id) => buildRecord(id));
        await saveStaffAttendance(
          recordsToCreate.map((record) => ({ ...record })),
        );
        setHasExistingRecords(true);
        setDirtyIds(new Set());
        return;
      }

      const recordsToUpdate = Array.from(dirtyIds).map((id) => buildRecord(id));
      await saveStaffAttendance(
        recordsToUpdate.map((record) => ({ ...record })),
      );
      setDirtyIds(new Set());
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  const columns: ColumnI<EmployeeI>[] = useMemo(
    () => [
      {
        value: "employeeCode",
        text: "common.tableHeader.employeeCode",
        render: (e) => (
          <span className="text-crm-label-text font-mono font-bold">
            EMP{e.id}
          </span>
        ),
      },
      {
        value: "fullName",
        text: "common.tableHeader.fullName",
        render: (e) => (
          <span className="text-crm-heading-text text-[16px] font-bold">
            {e.fullName}
          </span>
        ),
      },
      {
        value: "role",
        text: "common.tableHeader.role",
        render: (e: EmployeeI) => {
          const role = EMPLOYEE_ROLE[e.role as EmployeeRole];
          return <StatusBadge label={role.label} colors="var(--crm-primary)" />;
        },
      },
      {
        value: "workStatus",
        text: "common.tableHeader.workStatus",
        render: (e) => {
          if (!e.id) return null;
          const record = attendanceMap[e.id];
          return (
            <div className="w-40">
              <SelectField
                label=""
                options={STATUS_OPTIONS}
                value={record?.status || "present"}
                onChange={(evt) =>
                  handleRecordChange(e.id!, "status", evt.target.value)
                }
              />
            </div>
          );
        },
      },
      {
        value: "checkInTime",
        text: "common.tableHeader.checkInTime",
        render: (e) => {
          if (!e.id) return null;
          const record = attendanceMap[e.id];
          const isOff = record?.status ? isOffStatus(record.status) : false;
          return (
            <div className="w-32">
              <InputField
                label=""
                id={`time-${e.id}`}
                name="checkInTime"
                type="time"
                value={isOff ? "" : record?.checkInTime || "08:00"}
                disabled={isOff}
                onChange={(evt) =>
                  handleRecordChange(e.id!, "checkInTime", evt.target.value)
                }
              />
            </div>
          );
        },
      },
      {
        value: "notes",
        text: "common.tableHeader.notes",
        render: (e) => {
          if (!e.id) return null;
          const record = attendanceMap[e.id];
          return (
            <InputField
              label=""
              id={`note-${e.id}`}
              name="note"
              placeholder="staffTimeKeepingPage.notePlaceholder"
              value={record?.note || ""}
              onChange={(evt) =>
                handleRecordChange(e.id!, "note", evt.target.value)
              }
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attendanceMap],
  );

  return (
    <div className="space-y-4">
      <CardBase
        title="common.cardTitle.attendanceSheet"
        desc="common.cardDesc.dailyAttendance"
        className="flex items-center justify-between"
      >
        <div className="flex shrink-0 items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-crm-border bg-crm-surface text-crm-heading-text focus:border-crm-primary rounded-xl border px-3 py-2 text-sm focus:outline-none"
          />

          <Button
            buttonTitle="common.button.saveTimekeeping"
            success
            leftIcon={<CheckDoubleIcon />}
            onClick={handleSave}
          />
        </div>
      </CardBase>

      <CardBase>
        <Table<EmployeeI>
          columns={columns}
          rows={employees || []}
          height="max-h-[calc(100vh-260px)]"
        />
      </CardBase>
    </div>
  );
}

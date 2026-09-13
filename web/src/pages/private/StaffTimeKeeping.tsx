import { useState, useMemo, useEffect, useCallback } from "react";

import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import Table from "@/components/Table";
import { InputField, SelectField } from "@/components/Form";
import { CheckDoubleIcon } from "@/components/Icons";
import {
  useAppToast,
  useAttendanceSave,
  useFetchData,
  usePagination,
} from "@/hooks";
import { getEmployees } from "@/services/employee";
import {
  getStaffAttendanceByDate,
  saveStaffAttendance,
} from "@/services/employee";
import type {
  EmployeeI,
  EmployeeRole,
  StaffAttendanceI,
  StaffAttendanceStatus,
} from "@/types/database";
import type { ColumnI } from "@/types/table";
import { EMPLOYEE_ROLE } from "@/constants/employeeRole";
import { StatusBadge } from "@/components/ui";

const STATUS_OPTIONS = [
  { label: "staffTimeKeepingPage.status.present", value: "present" },
  { label: "staffTimeKeepingPage.status.late", value: "late" },
  { label: "staffTimeKeepingPage.status.absent", value: "absent" },
  { label: "staffTimeKeepingPage.status.leave", value: "leave" },
];

const isOffStatus = (status: StaffAttendanceStatus) =>
  status === "absent" || status === "leave";

export default function StaffAttendance() {
  const toastMsg = useAppToast();
  const { page, limit, onPageChange, onLimitChange } = usePagination(10);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const { data, refetch } = useFetchData(
    () => getEmployees(page, limit),
    [page, limit],
  );
  const employees = useMemo(() => data?.items || [], [data?.items]);

  const [attendanceMap, setAttendanceMap] = useState<
    Record<number, StaffAttendanceI>
  >({});

  const validEmployees = useMemo(
    () =>
      (employees || []).filter((emp): emp is EmployeeI & { id: number } =>
        Boolean(emp.id),
      ),
    [employees],
  );
  const total = data?.total ?? 0;

  // Build payload cho 1 nhân viên — bỏ checkInTime nếu status là absent/leave
  const buildRecord = useCallback(
    (employeeId: number): StaffAttendanceI => {
      const currentData = attendanceMap[employeeId];
      const status: StaffAttendanceStatus = currentData?.status || "present";

      const record: StaffAttendanceI = {
        employeeId,
        date: selectedDate,
        status,
        note: currentData?.note || "",
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

  const { handleSave, markDirty, setHasExistingRecords, setDirtyIds } =
    useAttendanceSave({
      items: validEmployees,
      getItemId: (emp) => emp.id,
      buildRecord: (emp) => buildRecord(emp.id),
      saveFn: saveStaffAttendance,
      toastMsg,
      onSuccess: refetch,
    });

  useEffect(() => {
    if (!employees || employees.length === 0) return;

    async function fetchAttendance() {
      try {
        const records = (await getStaffAttendanceByDate(
          selectedDate,
        )) as unknown as StaffAttendanceI[] | undefined;

        const map: Record<number, StaffAttendanceI> = {};

        employees?.forEach((emp) => {
          if (!emp.id) return;
          const existing = records?.find(
            (r: StaffAttendanceI) => Number(r.employeeId) === emp.id,
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
  }, [selectedDate, employees, setHasExistingRecords, setDirtyIds]);

  const handleRecordChange = useCallback(
    (
      employeeId: number,
      field: keyof Omit<StaffAttendanceI, "employeeId" | "date">,
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

      markDirty(employeeId);
    },
    [selectedDate, markDirty],
  );

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
                size="sm"
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
                size="sm"
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
              size="sm"
              value={record?.note || ""}
              onChange={(evt) =>
                handleRecordChange(e.id!, "note", evt.target.value)
              }
            />
          );
        },
      },
    ],
    [attendanceMap, handleRecordChange],
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
          height="max-h-[calc(100vh-320px)]"
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </CardBase>
    </div>
  );
}

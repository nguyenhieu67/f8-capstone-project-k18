import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { CheckDoubleIcon } from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "employeeCode", text: "common.tableHeader.employeeCode" },
  { value: "fullName", text: "common.tableHeader.fullName" },
  { value: "position", text: "common.tableHeader.position" },
  { value: "workStatus", text: "common.tableHeader.workStatus" },
  { value: "checkInTime", text: "common.tableHeader.checkInTime" },
  { value: "notes", text: "common.tableHeader.notes" },
];

export default function StaffTimeKeeping() {
  return (
    <>
      <div>
        <CardBase title="common.tableTitle.attendanceSheet">
          <Button
            buttonTitle="common.buttonTitle.saveTimekeeping"
            success
            leftIcon={<CheckDoubleIcon />}
          />
        </CardBase>
      </div>
      <div>
        <CardBase>
          <Table columns={COLUMNS} />
        </CardBase>
      </div>
    </>
  );
}

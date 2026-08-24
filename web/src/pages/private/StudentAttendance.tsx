import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { SaveIcon } from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "stt", text: "common.tableHeader.stt" },
  { value: "fullName", text: "common.tableHeader.fullName" },
  { value: "phone", text: "common.tableHeader.phone" },
  { value: "attendanceStatus", text: "common.tableHeader.attendanceStatus" },
  { value: "notes", text: "common.tableHeader.notes" },
];

export default function StudentAttendance() {
  return (
    <>
      <div>
        <CardBase>
          <Button
            buttonTitle="common.buttonTitle.saveAttendance"
            success
            leftIcon={<SaveIcon />}
          />
        </CardBase>
      </div>
      <CardBase title="common.cardTitle.classAttendance">
        <div className="mt-4">
          <Table columns={COLUMNS} />
        </div>
      </CardBase>
    </>
  );
}

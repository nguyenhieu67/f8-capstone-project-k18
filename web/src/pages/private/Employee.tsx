import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { UserPlusIcon } from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "employeeCode", text: "common.tableHeader.employeeCode" },
  { value: "fullName", text: "common.tableHeader.fullName" },
  { value: "position", text: "common.tableHeader.position" },
  { value: "phone", text: "common.tableHeader.phone" },
  { value: "baseSalary", text: "common.tableHeader.baseSalary" },
  { value: "commissionRate", text: "common.tableHeader.commissionRate" },
  { value: "actions", text: "common.tableHeader.actions" },
];

export default function Employee() {
  return (
    <>
      <div>
        <CardBase title="common.tableTitle.employeeList">
          <Button
            buttonTitle="common.buttonTitle.addEmployee"
            gradient
            leftIcon={<UserPlusIcon />}
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

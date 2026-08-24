import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { PlusIcon } from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "customerPhone", text: "common.tableHeader.customerPhone" },
  { value: "adSource", text: "common.tableHeader.adSource" },
  { value: "learningPurpose", text: "common.tableHeader.learningPurpose" },
  { value: "targetAudience", text: "common.tableHeader.targetAudience" },
  { value: "assignedSeller", text: "common.tableHeader.assignedSeller" },
  { value: "status", text: "common.tableHeader.status" },
  { value: "rejectionReason", text: "common.tableHeader.rejectionReason" },
  { value: "actions", text: "common.tableHeader.actions" },
];

export default function PreSale() {
  return (
    <>
      <div>
        <CardBase>
          <Button
            buttonTitle="common.button.addLead"
            gradient
            leftIcon={<PlusIcon size="sm" />}
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

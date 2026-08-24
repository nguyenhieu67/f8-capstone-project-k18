import { CardBase } from "@/components/Card";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "student", text: "common.tableHeader.student" },
  { value: "phone", text: "common.tableHeader.phone" },
  { value: "adSource", text: "common.tableHeader.adSource" },
  { value: "purposeAndTarget", text: "common.tableHeader.purposeAndTarget" },
  { value: "closedBySeller", text: "common.tableHeader.closedBySeller" },
  { value: "class", text: "common.tableHeader.class" },
  { value: "revenue", text: "common.tableHeader.revenue" },
];

export default function SaleResult() {
  return (
    <>
      <div>
        <CardBase title={"common.tableTitle.salesAndRevenueStats"}>
          Tổng Doanh Thu Đã Thu
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

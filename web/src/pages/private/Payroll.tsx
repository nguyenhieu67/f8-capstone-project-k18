import Button from "@/components/Button";
import { CardBase } from "@/components/Card";
import { PrintIcon } from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "employee", text: "common.tableHeader.employee" },
  { value: "baseSalary", text: "common.tableHeader.baseSalary" },
  { value: "salesVolume", text: "common.tableHeader.salesVolume" },
  {
    value: "commission3Percent",
    text: "common.tableHeader.commission3Percent",
  },
  { value: "grossIncome", text: "common.tableHeader.grossIncome" },
  { value: "insuranceTotal", text: "common.tableHeader.insuranceTotal" },
  { value: "pitTax", text: "common.tableHeader.pitTax" },
  { value: "netSalary", text: "common.tableHeader.netSalary" },
  { value: "details", text: "common.tableHeader.details" },
];

export default function Payroll() {
  return (
    <>
      <div>
        <CardBase
          title="common.cardTitle.payrollAndTaxStatement"
          desc="common.cardDesc.payrollCalculation"
          className="flex items-center justify-between"
        >
          <Button
            buttonTitle="common.button.printPayroll"
            info
            leftIcon={<PrintIcon />}
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

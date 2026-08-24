import { CardBase, StatCard } from "@/components/Card";
import {
  ConisIcon,
  MedalIcon,
  SackDollarIcon,
  TriangleExclIcon,
  UserCheckIcon,
  UserViewFinderIcon,
} from "@/components/Icons";
import Table from "@/components/Table";

const COLUMNS = [
  { value: "employee", text: "common.tableHeader.employee" },
  { value: "ordersCount", text: "common.tableHeader.ordersCount" },
  { value: "salesVolume", text: "common.tableHeader.salesVolume" },
  {
    value: "commission3Percent",
    text: "common.tableHeader.commission3Percent",
  },
];

export default function Dashboard() {
  return (
    <>
      <div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="common.summaryTitle.totalRevenue"
            value={1}
            subtext="common.summaryDesc.comparedToLastMonth"
            icon={<SackDollarIcon />}
            status="success"
          />
          <StatCard
            title="common.summaryTitle.totalLeads"
            value={1}
            subtext="common.summaryDesc.leadSources"
            icon={<UserViewFinderIcon />}
            status="primary"
          />
          <StatCard
            title="common.summaryTitle.registeredStudents"
            value={1}
            subtext="common.summaryDesc.conversionRate"
            icon={<UserCheckIcon />}
            status="info"
          />
          <StatCard
            title="common.summaryTitle.totalPayrollAndCommission"
            value={1}
            subtext="common.summaryDesc.salaryAndCommissionDetail"
            icon={<ConisIcon />}
            status="warning"
          />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardBase
            title={"common.cardTitle.salesLeaderboard"}
            icon={<MedalIcon className="text-crm-warning" />}
          >
            <div className="mt-4">
              <Table columns={COLUMNS} />
            </div>
          </CardBase>
          <CardBase
            title={"common.cardTitle.commonRejectionReasons"}
            icon={<TriangleExclIcon className="text-crm-danger" />}
          >
            <div className="mt-4">123</div>
          </CardBase>
        </div>
      </div>
    </>
  );
}

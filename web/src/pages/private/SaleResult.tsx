import { useMemo } from "react";
import { CardBase } from "@/components/Card";
import Table from "@/components/Table";
import { useFetchData, usePagination } from "@/hooks";
import { getClasses } from "@/services/classe";
import { getLeads } from "@/services/lead";
import { getSources } from "@/services/source";
import type {
  ClasseI,
  LeadI,
  SourceI,
  StudentI,
  StudentClasseI,
  EmployeeI,
} from "@/types/database";
import { getStudentClasses } from "@/services/students";
import { getStudents } from "@/services/students";
import { getEmployees } from "@/services/employee";
import { formatCurrency } from "@/utils/format";

const getColumns = (
  students: StudentI[],
  leads: LeadI[],
  sources: SourceI[],
  classes: ClasseI[],
  employees: EmployeeI[],
) => {
  const getLeadOf = (sc: StudentClasseI) => {
    const student = students.find((s) => s.id === Number(sc.studentId));
    if (!student) return undefined;
    return leads.find((l) => l.id === Number(student.leadId));
  };

  return [
    {
      value: "student",
      text: "common.tableHeader.student",
      render: (sc: StudentClasseI) => {
        const lead = getLeadOf(sc);
        return (
          <span className="text-crm-heading-text text-[16px] font-bold">
            {lead?.fullName}
          </span>
        );
      },
    },
    {
      value: "phone",
      text: "common.tableHeader.phone",
      render: (sc: StudentClasseI) => (
        <span className="text-crm-info font-mono">
          {getLeadOf(sc)?.phone ?? ""}
        </span>
      ),
    },
    {
      value: "adSource",
      text: "common.tableHeader.adSource",
      render: (sc: StudentClasseI) => {
        const lead = getLeadOf(sc);
        return (
          <span className="font-mono">
            {sources.find((src) => src.id === Number(lead?.sourceId))?.name ??
              ""}
          </span>
        );
      },
    },
    {
      value: "purposeAndTarget",
      text: "common.tableHeader.purposeAndTarget",
      render: (sc: StudentClasseI) => {
        const lead = getLeadOf(sc);

        return (
          <>
            {lead?.purpose && lead.who ? (
              <>
                <span>{lead?.purpose ?? ""}</span>
                <span className="block text-xs text-slate-500">
                  {lead?.who ?? ""}
                </span>
              </>
            ) : (
              <span className="text-crm-danger font-medium">-</span>
            )}
          </>
        );
      },
    },
    {
      value: "closedBySeller",
      text: "common.tableHeader.closedBySeller",
      render: (sc: StudentClasseI) => {
        const lead = getLeadOf(sc);
        const emplyee = employees.find((e) => e.id === Number(lead?.sellerId));
        return <span className="font-semibold">{emplyee?.fullName}</span>;
      },
    },
    {
      value: "class",
      text: "common.tableHeader.class",
      render: (sc: StudentClasseI) => (
        <span className="text-crm-accent font-semibold">
          {classes.find((c) => c.id === Number(sc.classId))?.name ?? ""}
        </span>
      ),
    },
    {
      value: "revenue",
      text: "common.tableHeader.revenue",
      render: (sc: StudentClasseI) => (
        <span className="text-crm-primary font-mono">
          {formatCurrency(sc.tuitionAmount, "VNĐ") ?? 0}
        </span>
      ),
    },
  ];
};

export default function SaleResult() {
  const { page, limit, onPageChange, onLimitChange } = usePagination(10);
  const { data } = useFetchData(
    {
      studentClasses: () => getStudentClasses(page, limit),
      students: () => getStudents(),
      employees: () => getEmployees(),
      leads: () => getLeads(),
      sources: () => getSources(),
      classes: () => getClasses(),
    },
    [page, limit],
  );

  const studentClasses = useMemo(
    () => data?.studentClasses.items || [],
    [data?.studentClasses.items],
  );
  const total = data?.studentClasses.total ?? 0;
  const students = useMemo(
    () => data?.students.items || [],
    [data?.students.items],
  );
  const leads = useMemo(() => data?.leads.items || [], [data?.leads.items]);
  const employees = useMemo(
    () => data?.employees.items || [],
    [data?.employees.items],
  );
  const sources = useMemo(
    () => data?.sources.items || [],
    [data?.sources.items],
  );
  const classes = useMemo(
    () => data?.classes.items || [],
    [data?.classes.items],
  );

  const columns = useMemo(
    () => getColumns(students, leads, sources, classes, employees),
    [students, leads, sources, classes, employees],
  );

  const revenue = useMemo(
    () =>
      studentClasses.reduce(
        (acc, sc) => acc + Number(sc.tuitionAmount || 0),
        0,
      ),
    [studentClasses],
  );

  return (
    <>
      <CardBase
        title="common.cardTitle.salesAndRevenueStats"
        desc="common.cardDesc.enrolledStudents"
        className="flex items-center justify-between"
      >
        <div className="flex flex-col justify-center">
          <span className="text-crm-success font-mono text-2xl">
            {formatCurrency(revenue)}
          </span>
          Tổng Doanh Thu Đã Thu
        </div>
      </CardBase>
      <CardBase>
        <Table
          columns={columns}
          rows={studentClasses}
          height="max-h-[calc(100vh-340px)]"
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </CardBase>
    </>
  );
}

import Button from "@/components/Button";
import { CardBase, ClassCard } from "@/components/Card";
import { PlusIcon } from "@/components/Icons";

export default function Classe() {
  return (
    <>
      <div>
        <CardBase title="common.tableTitle.courseAndClassManagement">
          <Button
            buttonTitle="common.buttonTitle.addClass"
            gradient
            leftIcon={<PlusIcon size="sm" />}
          />
        </CardBase>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ClassCard
          code="K19"
          name="Fullstack K19"
          status="Đang mở"
          schedule="T2 - T4 - T6 (18:30 - 21:00)"
          trainer="Lê Thị Thu"
          fee={18000000}
          totalStudents="10"
        />
        <ClassCard
          code="K19"
          name="Fullstack K19"
          status="Đang mở"
          schedule="T2 - T4 - T6 (18:30 - 21:00)"
          trainer="Lê Thị Thu"
          fee={18000000}
          totalStudents="10"
        />
        <ClassCard
          code="K19"
          name="Fullstack K19"
          status="Đang mở"
          schedule="T2 - T4 - T6 (18:30 - 21:00)"
          trainer="Lê Thị Thu"
          fee={18000000}
          totalStudents="10"
        />
      </div>
    </>
  );
}

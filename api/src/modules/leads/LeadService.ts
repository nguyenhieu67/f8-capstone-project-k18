import { UpdateResult } from "typeorm";
import { BaseService } from "@/common";
import { AppDataSource, constants } from "@/config";
import { validateEmployeeRole } from "@/modules/employees/helpers/validateEmployeeRole";
import { EmployeeRole } from "@/modules/employees/EmployeeEntity";
import { LeadEntity, LeadStatus } from "./LeadEntity";
import { StudentEntity } from "@/modules/students/StudentEntity";
import { ClasseEntity } from "@/modules/classes/ClasseEntity";
import { StudentClasseEntity, StudentClasseStatus } from "../students/studentClasse/StudentClasseEntity";
import { AppError } from "@/utils";

class LeadService extends BaseService {
  protected fkValidators = [
    {
      field: "sellerId",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.SALE, "sellerId"),
    },
  ];

  private async ensureStudentEnrollment(
    leadId: number,
    payload: { classeId: number; revenue: number; createdBy?: number },
    manager = AppDataSource.manager,
  ) {
    const studentRepo = manager.getRepository(StudentEntity);
    const studentClassRepo = manager.getRepository(StudentClasseEntity);

    let student = await studentRepo.findOne({ where: { leadId } });

    if (!student) {
      await studentRepo
        .createQueryBuilder()
        .insert()
        .into(StudentEntity)
        .values([
          {
            leadId,
            enrolledAt: new Date(),
            createdBy: payload.createdBy,
            isActive: true,
          },
        ])
        .execute();

      student = await studentRepo.findOne({ where: { leadId } });
    }

    if (!student) {
      throw new AppError("Không thể tạo student cho lead", constants.httpCodes.badRequest);
    }

    const existingEnrollment = await studentClassRepo.findOne({
      where: { studentId: student.id, classId: payload.classeId },
    });

    if (!existingEnrollment) {
      await studentClassRepo
        .createQueryBuilder()
        .insert()
        .into(StudentClasseEntity)
        .values([
          {
            studentId: student.id,
            classId: payload.classeId,
            tuitionAmount: payload.revenue,
            status: StudentClasseStatus.ACTIVE,
            createdBy: payload.createdBy,
            isActive: true,
          },
        ])
        .execute();
    }

    return student;
  }

  private async validateConvertPayload(data: any) {
    if (!data.classeId) {
      throw new AppError("Cần chọn lớp học khi chuyển lead sang trạng thái converted", constants.httpCodes.badRequest);
    }

    const classe = await AppDataSource.getRepository(ClasseEntity).findOne({
      where: { id: data.classeId, isActive: true },
    });
    if (!classe) {
      throw new AppError("Lớp học không tồn tại", constants.httpCodes.badRequest);
    }
  }

  async create(data: any) {
    const isConvertingStatus = data.status === LeadStatus.CONVERTED;

    if (!isConvertingStatus) {
      return super.create(data);
    }

    await this.validateConvertPayload(data);

    return AppDataSource.transaction(async (manager) => {
      const leadRepo = manager.getRepository(LeadEntity);

      const safeLeadData = this.pickEntityColumns(data);
      this.fkValidators = [
        {
          field: "sellerId",
          validate: (id: number) => validateEmployeeRole(id, EmployeeRole.SALE, "sellerId"),
        },
      ];

      const insertResult = await leadRepo
        .createQueryBuilder()
        .insert()
        .into(LeadEntity)
        .values([safeLeadData])
        .returning(["id"])
        .execute();

      const leadId = insertResult.identifiers[0].id;

      await this.ensureStudentEnrollment(
        leadId,
        { classeId: data.classeId, revenue: data.revenue, createdBy: data.createdBy },
        manager,
      );

      return this.getById(leadId);
    });
  }

  async updateById(id: number, data: any): Promise<UpdateResult> {
    const isConvertingStatus = data.status === LeadStatus.CONVERTED;

    if (!isConvertingStatus) {
      return super.updateById(id, data);
    }

    await this.validateConvertPayload(data);

    return AppDataSource.transaction(async (manager) => {
      const leadRepo = manager.getRepository(LeadEntity);

      const lead = await leadRepo
        .createQueryBuilder("lead")
        .setLock("pessimistic_write")
        .where("lead.id = :id AND lead.isActive = true", { id })
        .getOne();

      if (!lead) {
        throw new AppError("Lead không tồn tại", constants.httpCodes.badRequest);
      }

      const wasAlreadyConverted = lead.status === LeadStatus.CONVERTED;

      const safeLeadData = this.pickEntityColumns(data);

      const updateResult = await leadRepo
        .createQueryBuilder()
        .update(LeadEntity)
        .set(safeLeadData)
        .where("id = :id", { id })
        .returning(["id"])
        .execute();

      if (!wasAlreadyConverted) {
        await this.ensureStudentEnrollment(
          id,
          { classeId: data.classeId, revenue: data.revenue, createdBy: data.updatedBy },
          manager,
        );
      }

      return updateResult;
    });
  }
}

export default new LeadService(LeadEntity);

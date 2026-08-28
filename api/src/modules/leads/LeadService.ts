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
    payload: { classe: ClasseEntity; createdBy?: number },
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
          },
        ])
        .execute();

      student = await studentRepo.findOne({ where: { leadId } });
    }

    if (!student) {
      throw new AppError("Không thể tạo student cho lead", constants.httpCodes.badRequest);
    }

    const existingEnrollment = await studentClassRepo.findOne({
      where: { studentId: student.id, classId: payload.classe.id },
    });

    if (!existingEnrollment) {
      await studentClassRepo
        .createQueryBuilder()
        .insert()
        .into(StudentClasseEntity)
        .values([
          {
            studentId: student.id,
            classId: payload.classe.id,
            tuitionAmount: payload.classe.tuition,
            status: StudentClasseStatus.ACTIVE,
            createdBy: payload.createdBy,
          },
        ])
        .execute();
    }

    return student;
  }

  private async validateConvertPayload(data: any): Promise<ClasseEntity> {
    if (!data.classeId) {
      throw new AppError("Cần chọn lớp học khi chuyển lead sang trạng thái converted", constants.httpCodes.badRequest);
    }

    const classe = await AppDataSource.getRepository(ClasseEntity).findOne({
      where: { id: data.classeId, isActive: true },
    });
    if (!classe) {
      throw new AppError("Lớp học không tồn tại", constants.httpCodes.badRequest);
    }

    return classe;
  }

  async create(data: any) {
    const isConvertingStatus = data.status === LeadStatus.CONVERTED;

    if (!isConvertingStatus) {
      return super.create(data);
    }

    const classe = await this.validateConvertPayload(data);

    return AppDataSource.transaction(async (manager) => {
      const leadRepo = manager.getRepository(LeadEntity);
      const safeLeadData = this.pickEntityColumns(data);

      const insertResult = await leadRepo
        .createQueryBuilder()
        .insert()
        .into(LeadEntity)
        .values([safeLeadData])
        .returning(["id"])
        .execute();

      const leadId = insertResult.identifiers[0].id;

      await this.ensureStudentEnrollment(leadId, { classe, createdBy: data.createdBy }, manager);

      return this.getById(leadId);
    });
  }

  async updateById(id: number, data: any): Promise<UpdateResult> {
    const isConvertingStatus = data.status === LeadStatus.CONVERTED;

    if (!isConvertingStatus) {
      return super.updateById(id, data);
    }

    const classe = await this.validateConvertPayload(data);

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
        await this.ensureStudentEnrollment(id, { classe, createdBy: data.updatedBy }, manager);
      }

      return updateResult;
    });
  }
}

export default new LeadService(LeadEntity);

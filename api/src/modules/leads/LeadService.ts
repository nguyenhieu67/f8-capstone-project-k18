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
    payload: { classe: ClasseEntity; createdBy?: number; updatedBy?: number },
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

    const activeEnrollment = await studentClassRepo.findOne({
      where: { studentId: student.id, status: StudentClasseStatus.ACTIVE },
    });

    if (!activeEnrollment) {
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
    } else if (activeEnrollment.classId !== payload.classe.id) {
      await studentClassRepo
        .createQueryBuilder()
        .update(StudentClasseEntity)
        .set({
          classId: payload.classe.id,
          tuitionAmount: payload.classe.tuition,
          updatedBy: payload.updatedBy,
        })
        .where("id = :id", { id: activeEnrollment.id })
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
      const isChangingClasse = wasAlreadyConverted && data.classeId !== undefined && data.classeId !== lead.classeId;

      let classe: ClasseEntity | undefined;

      if (isConvertingStatus || isChangingClasse) {
        classe = await this.validateConvertPayload(data);
      }

      const safeLeadData = this.pickEntityColumns(data);

      const updateResult = await leadRepo
        .createQueryBuilder()
        .update(LeadEntity)
        .set(safeLeadData)
        .where("id = :id", { id })
        .returning(["id"])
        .execute();

      if ((isConvertingStatus && !wasAlreadyConverted) || isChangingClasse) {
        await this.ensureStudentEnrollment(
          id,
          { classe: classe!, createdBy: data.updatedBy, updatedBy: data.updatedBy },
          manager,
        );
      }

      return updateResult;
    });
  }
}

export default new LeadService(LeadEntity);

import { Brackets, SelectQueryBuilder, UpdateResult } from "typeorm";
import { BaseEntity, BaseService, SimpleEntity } from "@/common";
import { AppDataSource } from "@/config";
import { validateEmployeeRole } from "@/modules/employees/helpers/validateEmployeeRole";
import { EmployeeRole } from "@/modules/employees/EmployeeEntity";
import { LeadEntity, LeadStatus } from "./LeadEntity";
import { StudentEntity } from "@/modules/students/StudentEntity";
import { ClasseEntity } from "@/modules/classes/ClasseEntity";
import { StudentClasseEntity, StudentClasseStatus } from "../students/studentClasse/StudentClasseEntity";
import { AppError } from "@/utils";
import { escapeLike, isPhoneLike, normalizeSearchText, VN_FROM, VN_TO } from "./leadSearch";

class LeadService extends BaseService {
  protected fkValidators = [
    {
      field: "sellerId",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.SALE, "sellerId"),
    },
  ];

  // Tên khách (họ + tên) đã bỏ dấu + chữ thường, để so khớp với từ khoá đã chuẩn hoá (xem leadSearch.ts)
  private static readonly NORMALIZED_NAME_SQL = `lower(regexp_replace(translate(CONCAT_WS(' ', "lead"."first_name", "lead"."last_name"), :vnFrom, :vnTo), '[\\u0300-\\u036f]', '', 'g'))`;

  // condition: các điều kiện bằng (status, sourceId, sellerId...) + `search` (tên / SĐT, tuỳ chọn)
  handleFind(query: SelectQueryBuilder<BaseEntity | SimpleEntity>, condition: any) {
    const { search, ...equalityConditions } = condition ?? {};
    const filtered = super.handleFind(query, equalityConditions);

    const keyword = normalizeSearchText(search);
    if (!keyword) return filtered;

    return filtered.andWhere(
      new Brackets((qb) => {
        qb.where(`${LeadService.NORMALIZED_NAME_SQL} LIKE :nameLike ESCAPE '\\'`, {
          nameLike: `%${escapeLike(keyword)}%`,
          vnFrom: VN_FROM,
          vnTo: VN_TO,
        });

        const digits = keyword.replace(/\D/g, "");
        if (isPhoneLike(keyword) && digits) {
          // So khớp trên chữ số để "0912 345" vẫn tìm ra SĐT lưu dạng "0912345678" hoặc "0912.345.678"
          qb.orWhere(`regexp_replace(COALESCE("lead"."phone", ''), '\\D', '', 'g') LIKE :phoneLike`, {
            phoneLike: `%${digits}%`,
          });
        }
      }),
    );
  }

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
      throw AppError.badRequest("Không thể tạo student cho lead");
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
      throw AppError.badRequest("Cần chọn lớp học khi chuyển lead sang trạng thái converted");
    }

    const classe = await AppDataSource.getRepository(ClasseEntity).findOne({
      where: { id: data.classeId, isActive: true },
    });
    if (!classe) {
      throw AppError.notFound("Lớp học không tồn tại");
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
        throw AppError.notFound("Lead không tồn tại");
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

  async deleteById(id: number, deletedBy?: number) {
    return AppDataSource.transaction(async (manager) => {
      const leadRepo = manager.getRepository(LeadEntity);
      const studentRepo = manager.getRepository(StudentEntity);
      const studentClassRepo = manager.getRepository(StudentClasseEntity);

      const lead = await leadRepo.findOne({ where: { id, isActive: true } });
      if (!lead) {
        throw AppError.notFound("Lead không tồn tại hoặc đã bị xoá");
      }

      const student = await studentRepo.findOne({ where: { leadId: id, isActive: true } });

      if (student) {
        const now = new Date();

        await studentClassRepo
          .createQueryBuilder()
          .update(StudentClasseEntity)
          .set({
            isActive: false,
            deletedAt: now,
            deletedBy: deletedBy,
            updatedAt: now,
            updatedBy: deletedBy,
          })
          .where("studentId = :studentId AND isActive = true", { studentId: student.id })
          .execute();

        await studentRepo
          .createQueryBuilder()
          .update(StudentEntity)
          .set({
            isActive: false,
            deletedAt: now,
            deletedBy: deletedBy,
            updatedAt: now,
            updatedBy: deletedBy,
          })
          .where("id = :id", { id: student.id })
          .execute();
      }

      const now = new Date();
      return leadRepo
        .createQueryBuilder()
        .update(LeadEntity)
        .set({
          isActive: false,
          deletedAt: now,
          deletedBy: deletedBy,
          updatedAt: now,
          updatedBy: deletedBy,
        })
        .where("id = :id", { id })
        .execute();
    });
  }
}

export default new LeadService(LeadEntity);

import { Brackets, SelectQueryBuilder, UpdateResult } from "typeorm";
import { BaseEntity, BaseService, SimpleEntity } from "@/common";
import { AppDataSource } from "@/config";
import { validateEmployeeRole } from "@/modules/employees/helpers/validateEmployeeRole";
import { EmployeeRole } from "@/modules/employees/EmployeeEntity";
import { LeadEntity, LeadStatus } from "./LeadEntity";
import { StudentEntity } from "@/modules/students/StudentEntity";
import { ClasseEntity, ClasseStatus } from "@/modules/classes/ClasseEntity";
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
    payload: { classe: ClasseEntity; previousClassId?: number; createdBy?: number; updatedBy?: number },
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

    const activeEnrollments = await studentClassRepo.find({
      where: { studentId: student.id, status: StudentClasseStatus.ACTIVE, isActive: true },
    });

    const targetClassId = Number(payload.classe.id);
    const alreadyInTarget = activeEnrollments.some((e) => Number(e.classId) === targetClassId);

    if (alreadyInTarget) {
      if (payload.previousClassId !== undefined && payload.previousClassId !== targetClassId) {
        throw AppError.badRequest("Học viên đã đăng ký lớp này rồi, hãy chọn lớp khác.");
      }
      return student;
    }

    const primaryEnrollment =
      payload.previousClassId !== undefined
        ? activeEnrollments.find((e) => Number(e.classId) === payload.previousClassId)
        : undefined;

    if (primaryEnrollment) {
      await studentClassRepo
        .createQueryBuilder()
        .update(StudentClasseEntity)
        .set({
          classId: payload.classe.id,
          tuitionAmount: payload.classe.tuition,
          updatedBy: payload.updatedBy,
        })
        .where("id = :id", { id: primaryEnrollment.id })
        .execute();
    } else {
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

    const leadId = await AppDataSource.transaction(async (manager) => {
      const leadRepo = manager.getRepository(LeadEntity);
      const safeLeadData = this.pickEntityColumns(data);

      const insertResult = await leadRepo
        .createQueryBuilder()
        .insert()
        .into(LeadEntity)
        .values([safeLeadData])
        .returning(["id"])
        .execute();

      const newLeadId = insertResult.identifiers[0].id;

      await this.ensureStudentEnrollment(newLeadId, { classe, createdBy: data.createdBy }, manager);

      return newLeadId;
    });

    return this.getById(leadId);
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
      const currentClasseId = lead.classeId != null ? Number(lead.classeId) : undefined;
      const isChangingClasse =
        wasAlreadyConverted && data.classeId !== undefined && Number(data.classeId) !== currentClasseId;

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
          { classe: classe!, previousClassId: currentClasseId, createdBy: data.updatedBy, updatedBy: data.updatedBy },
          manager,
        );
      }

      return updateResult;
    });
  }

  async getEnrolledClasses(leadIds: number[]) {
    const result = new Map<number, { classId: number; status: StudentClasseStatus }[]>();
    if (leadIds.length === 0) return result;

    const rows = (await AppDataSource.query(
      `
      SELECT s.lead_id AS "leadId", sc.class_id AS "classId", sc.status AS "status"
      FROM student s
      JOIN student_classe sc ON sc.student_id = s.id AND sc.is_active = true AND sc.status IN ('active', 'completed')
      WHERE s.is_active = true AND s.lead_id = ANY($1::bigint[])
      ORDER BY sc.id ASC
      `,
      [leadIds],
    )) as { leadId: string; classId: string; status: StudentClasseStatus }[];

    for (const row of rows) {
      const key = Number(row.leadId);
      result.set(key, [...(result.get(key) ?? []), { classId: Number(row.classId), status: row.status }]);
    }
    return result;
  }

  async addEnrollment(leadId: number, classId: number, createdBy?: number) {
    return AppDataSource.transaction(async (manager) => {
      const lead = await manager.getRepository(LeadEntity).findOne({ where: { id: leadId, isActive: true } });
      if (!lead) {
        throw AppError.notFound("Lead không tồn tại");
      }
      if (lead.status !== LeadStatus.CONVERTED) {
        throw AppError.badRequest("Chỉ thêm lớp học cho lead đã chốt đơn (converted)");
      }

      const classe = await manager.getRepository(ClasseEntity).findOne({ where: { id: classId, isActive: true } });
      if (!classe) {
        throw AppError.notFound("Lớp học không tồn tại");
      }
      if (classe.status === ClasseStatus.CLOSED || classe.status === ClasseStatus.COMPLETED) {
        throw AppError.badRequest("Lớp học đã kết thúc hoặc đã đóng, không thể thêm học viên");
      }

      const student = await manager
        .getRepository(StudentEntity)
        .createQueryBuilder("student")
        .setLock("pessimistic_write")
        .where("student.leadId = :leadId AND student.isActive = true", { leadId })
        .getOne();
      if (!student) {
        throw AppError.badRequest("Lead này chưa có học viên, hãy mở lại lead và chọn lớp để chốt đơn");
      }

      const studentClassRepo = manager.getRepository(StudentClasseEntity);
      const existing = await studentClassRepo.findOne({
        where: { studentId: student.id, classId: classe.id, isActive: true },
      });
      if (existing) {
        throw AppError.conflict("Học viên đã đăng ký lớp này rồi");
      }

      const insertResult = await studentClassRepo
        .createQueryBuilder()
        .insert()
        .into(StudentClasseEntity)
        .values([
          {
            studentId: student.id,
            classId: classe.id,
            tuitionAmount: classe.tuition,
            status: StudentClasseStatus.ACTIVE,
            createdBy,
          },
        ])
        .returning(["id"])
        .execute();

      return {
        id: Number(insertResult.identifiers[0].id),
        studentId: Number(student.id),
        classId: Number(classe.id),
        tuitionAmount: Number(classe.tuition ?? 0),
        status: StudentClasseStatus.ACTIVE,
      };
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

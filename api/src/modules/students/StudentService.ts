import { AppDataSource } from "@/config";
import { AppError } from "@/utils";
import { LeadEntity, LeadStatus } from "@/modules/leads/LeadEntity";
import { BaseService } from "@/common";
import { StudentEntity } from "./StudentEntity";

class StudentService extends BaseService {
  private async validateTrainer(leadId: number) {
    const lead = await AppDataSource.getRepository(LeadEntity)
      .createQueryBuilder("lead")
      .where("lead.id = :id", { id: leadId })
      .andWhere("lead.status = :status", { status: LeadStatus.CONVERTED })
      .andWhere("lead.is_active = :isActive", { isActive: true })
      .getOne();

    if (!lead) {
      throw AppError.badRequest(`leadId ${leadId} không hợp lệ: lead không tồn tại hoặc không có status converted`);
    }
  }

  async create(data: any) {
    if (data.leadId) {
      await this.validateTrainer(data.leadId);
    }

    return super.create(data);
  }

  async updateById(id: number, data: any) {
    if (data.leadId) {
      await this.validateTrainer(data.leadId);
    }

    return super.updateById(id, data);
  }
}

export default new StudentService(StudentEntity);

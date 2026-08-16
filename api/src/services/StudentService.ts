import { BaseService } from "./BaseService";
import { LeadEntity, LeadStatus, StudentEntity } from "@/entities";
import { AppDataSource } from "@/config/database";

class StudentService extends BaseService {
  private async validateTrainer(leadId: number) {
    const lead = await AppDataSource.getRepository(LeadEntity)
      .createQueryBuilder("lead")
      .where("lead.id = :id", { id: leadId })
      .andWhere("lead.status = :status", { status: LeadStatus.CONVERTED })
      .andWhere("lead.is_active = :isActive", { isActive: true })
      .getOne();

    if (!lead) {
      throw new Error(`lead_id ${leadId} không hợp lệ: lead không tồn tại hoặc không có status converted`);
    }
  }

  async create(data: any) {
    if (data.lead_id) {
      await this.validateTrainer(data.lead_id);
    }

    return super.create(data);
  }

  async updateById(id: number, data: any) {
    if (data.lead_id) {
      await this.validateTrainer(data.lead_id);
    }

    return super.updateById(id, data);
  }
}

export default new StudentService(StudentEntity);

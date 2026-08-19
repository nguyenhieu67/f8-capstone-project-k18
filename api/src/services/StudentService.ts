import { AppDataSource, constants } from "@/config";
import { LeadEntity, LeadStatus, StudentEntity } from "@/entities";
import { AppError } from "@/utils";
import { BaseService } from "./BaseService";

class StudentService extends BaseService {
  private async validateTrainer(leadId: number) {
    const lead = await AppDataSource.getRepository(LeadEntity)
      .createQueryBuilder("lead")
      .where("lead.id = :id", { id: leadId })
      .andWhere("lead.status = :status", { status: LeadStatus.CONVERTED })
      .andWhere("lead.is_active = :isActive", { isActive: true })
      .getOne();

    if (!lead) {
      throw new AppError(
        `lead_id ${leadId} không hợp lệ: lead không tồn tại hoặc không có status converted`,
        constants.httpCodes.badRequest,
      );
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

import { BaseService } from "./BaseService";
import { LeadEntity } from "@/entities";
import { EmployeeEntity, EmployeeRole } from "@/entities/EmployeeEntity";
import { AppDataSource } from "@/config/database";

class LeadService extends BaseService {
  private async validateTrainer(leadId: number) {
    const sale = await AppDataSource.getRepository(EmployeeEntity)
      .createQueryBuilder("employee")
      .where("employee.id = :id", { id: leadId })
      .andWhere("employee.role = :role", { role: EmployeeRole.SALE })
      .andWhere("employee.is_active = :isActive", { isActive: true })
      .getOne();

    if (!sale) {
      throw new Error(
        `seller_id ${leadId} không hợp lệ: employee không tồn tại hoặc không có role sale`,
      );
    }
  }

  async create(data: any) {
    if (data.seller_id) {
      await this.validateTrainer(data.seller_id);
    }

    return super.create(data);
  }

  async updateById(id: number, data: any) {
    if (data.seller_id) {
      await this.validateTrainer(data.seller_id);
    }

    return super.updateById(id, data);
  }
}

const leadService = new LeadService(LeadEntity);

export default leadService;

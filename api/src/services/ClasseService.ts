import { BaseService } from "./BaseService";
import { ClasseEntity } from "@/entities";
import { EmployeeEntity, EmployeeRole } from "@/entities/EmployeeEntity";
import { AppDataSource } from "@/config/database";

class ClasseService extends BaseService {
  private async validateTrainer(trainerId: number) {
    const trainer = await AppDataSource.getRepository(EmployeeEntity)
      .createQueryBuilder("employee")
      .where("employee.id = :id", { id: trainerId })
      .andWhere("employee.role = :role", { role: EmployeeRole.TRAINER })
      .andWhere("employee.is_active = :isActive", { isActive: true })
      .getOne();

    if (!trainer) {
      throw new Error(
        `trainer_id ${trainerId} không hợp lệ: employee không tồn tại hoặc không có role trainer`,
      );
    }
  }

  async create(data: any) {
    if (data.trainer_id) {
      await this.validateTrainer(data.trainer_id);
    }

    return super.create(data);
  }

  async updateById(id: number, data: any) {
    if (data.trainer_id) {
      await this.validateTrainer(data.trainer_id);
    }

    return super.updateById(id, data);
  }
}

const classeService = new ClasseService(ClasseEntity);

export default classeService;

import { BaseService } from "@/common";
import { EmployeeEntity, EmployeeRole } from "./EmployeeEntity";
import { ClasseEntity } from "../classes/ClasseEntity";
import { AppDataSource } from "@/config";
import { AppError } from "@/utils";

class EmployeeService extends BaseService {
  async updateById(id: number, data: any) {
    if (data.role !== undefined && data.role !== EmployeeRole.TRAINER) {
      const assignedClass = await AppDataSource.getRepository(ClasseEntity)
        .createQueryBuilder("classe")
        .where("classe.trainer_id = :id", { id })
        .andWhere("classe.is_active = :isActive", { isActive: true })
        .getOne();

      if (assignedClass) {
        throw AppError.conflict(
          `Không thể đổi role: nhân viên hiện đang là trainer của lớp "${assignedClass.name}". Vui lòng đổi trainer khác cho lớp đó trước khi đổi role.`,
          { classeId: assignedClass.id, classeName: assignedClass.name },
        );
      }
    }

    return super.updateById(id, data);
  }
}

export default new EmployeeService(EmployeeEntity);

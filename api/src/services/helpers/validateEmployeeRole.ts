import { AppDataSource, constants } from "@/config";
import { EmployeeEntity, EmployeeRole } from "@/entities/EmployeeEntity";
import { AppError } from "@/utils";

export async function validateEmployeeRole(employeeId: number, role: EmployeeRole, fieldName: string) {
  const employee = await AppDataSource.getRepository(EmployeeEntity)
    .createQueryBuilder("employee")
    .where("employee.id = :id", { id: employeeId })
    .andWhere("employee.role = :role", { role })
    .andWhere("employee.is_active = :isActive", { isActive: true })
    .getOne();

  if (!employee) {
    throw new AppError(
      `${fieldName} ${employeeId} không hợp lệ: employee không tồn tại hoặc không có role ${role}`,
      constants.httpCodes.badRequest,
    );
  }
}

import { AppDataSource } from "@/config";
import { AppError } from "@/utils";
import { EmployeeEntity, EmployeeRole } from "../EmployeeEntity";

export async function validateEmployeeRole(employeeId: number, role: EmployeeRole, fieldName: string) {
  const employee = await AppDataSource.getRepository(EmployeeEntity)
    .createQueryBuilder("employee")
    .where("employee.id = :id", { id: employeeId })
    .andWhere("employee.role = :role", { role })
    .andWhere("employee.is_active = :isActive", { isActive: true })
    .getOne();

  if (!employee) {
    throw AppError.badRequest(
      `${fieldName} ${employeeId} không hợp lệ: employee không tồn tại hoặc không có role ${role}`,
    );
  }
}

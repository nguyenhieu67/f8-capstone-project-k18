import { AppDataSource } from "@/config/database";
import { EmployeeEntity, EmployeeRole } from "@/entities/EmployeeEntity";

export async function validateEmployeeRole(employeeId: number, role: EmployeeRole, fieldName: string) {
  const employee = await AppDataSource.getRepository(EmployeeEntity)
    .createQueryBuilder("employee")
    .where("employee.id = :id", { id: employeeId })
    .andWhere("employee.role = :role", { role })
    .andWhere("employee.is_active = :isActive", { isActive: true })
    .getOne();

  if (!employee) {
    throw new Error(`${fieldName} ${employeeId} không hợp lệ: employee không tồn tại hoặc không có role ${role}`);
  }
}

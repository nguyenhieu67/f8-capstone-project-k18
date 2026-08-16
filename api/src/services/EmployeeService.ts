import { EmployeeEntity } from "@/entities";
import { BaseService } from "./BaseService";

class EmployeeService extends BaseService {}

export default new EmployeeService(EmployeeEntity);

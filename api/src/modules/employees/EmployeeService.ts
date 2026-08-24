import { BaseService } from "@/common";
import { EmployeeEntity } from "./EmployeeEntity";

class EmployeeService extends BaseService {}

export default new EmployeeService(EmployeeEntity);

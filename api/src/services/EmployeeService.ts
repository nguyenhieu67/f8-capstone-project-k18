import { EmployeeEntity } from "@/entities";
import { BaseService } from "./BaseService";

class EmployeeService extends BaseService {}

const employeeService = new EmployeeService(EmployeeEntity);

export default employeeService;

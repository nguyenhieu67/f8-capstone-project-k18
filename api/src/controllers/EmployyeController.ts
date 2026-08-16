import { BaseController } from "./BaseController";
import employeeService from "@/services/EmployeeService";

class EmployeeController extends BaseController {}

export default new EmployeeController(employeeService);

import employeeService from "@/services/EmployeeService";
import { BaseController } from "./BaseController";

class EmployeeController extends BaseController {}

export default new EmployeeController(employeeService);

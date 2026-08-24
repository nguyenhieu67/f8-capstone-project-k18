import { BaseController } from "@/common";
import EmployeeService from "./EmployeeService";

class EmployeeController extends BaseController {}

export default new EmployeeController(EmployeeService);

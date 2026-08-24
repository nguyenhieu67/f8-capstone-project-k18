import { BaseController } from "@/common";
import EmployeeService from "./EmployeeService";
import { toEmployeeDto } from "./EmployeeDto";

class EmployeeController extends BaseController {}

export default new EmployeeController(EmployeeService, toEmployeeDto);

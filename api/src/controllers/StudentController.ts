import { studentService } from "@/services";
import { BaseController } from "./BaseController";

class StudentController extends BaseController {}

export default new StudentController(studentService);

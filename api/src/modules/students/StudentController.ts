import { BaseController } from "@/common";
import StudentService from "./StudentService";

class StudentController extends BaseController {}

export default new StudentController(StudentService);

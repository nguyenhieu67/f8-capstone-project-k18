import { BaseController } from "@/common";
import StudentClasseService from "./StudentClasseService";

class StudentClasseController extends BaseController {}

export default new StudentClasseController(StudentClasseService);

import { BaseService } from "@/common";
import { StudentAttendanceEntity } from "./StudentAttendanceEntity";

class StudentAttendanceService extends BaseService {
  async saveSessionAttendance(data: any[]) {
    return this.upsertMany(data, ["classId", "studentId", "date"], ["status", "note", "updatedBy"]);
  }
}

export default new StudentAttendanceService(StudentAttendanceEntity);

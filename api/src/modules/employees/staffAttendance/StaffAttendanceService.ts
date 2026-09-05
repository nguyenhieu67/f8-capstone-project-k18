import { BaseService } from "@/common";
import { StaffAttendanceEntity } from "./StaffAttendanceEntity";

class StaffAttendanceService extends BaseService {
  async saveSessionAttendance(data: any[]) {
    return this.upsertMany(data, ["employeeId", "date"], ["status", "checkInTime", "note", "updatedBy"]);
  }
}

export default new StaffAttendanceService(StaffAttendanceEntity);

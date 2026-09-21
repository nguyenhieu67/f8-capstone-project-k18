import { BaseService } from "@/common";
import { StaffAttendanceEntity } from "./StaffAttendanceEntity";

class StaffAttendanceService extends BaseService {
  async saveSessionAttendance(data: any[], userId: number) {
    const results = [];

    for (const item of data) {
      const existing = (await this.findOneBy({
        employeeId: item.employeeId,
        date: item.date,
      })) as StaffAttendanceEntity | null;

      if (!existing) {
        const newRecord = await this.create({
          employeeId: item.employeeId,
          date: item.date,
          status: item.status,
          checkInTime: item.checkInTime,
          note: item.note,
          createdBy: userId,
        });
        results.push(newRecord);
      } else {
        const isChanged =
          existing.status !== item.status ||
          existing.checkInTime !== item.checkInTime ||
          (existing.note || "") !== (item.note || "");

        if (isChanged) {
          await this.updateById(existing.id, {
            status: item.status,
            checkInTime: item.checkInTime,
            note: item.note,
            updatedBy: userId,
            updatedAt: new Date(),
          });
          results.push(await this.getById(existing.id));
        }
      }
    }

    return results;
  }
}

export default new StaffAttendanceService(StaffAttendanceEntity);

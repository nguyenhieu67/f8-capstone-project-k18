import { BaseService } from "@/common";
import { StudentAttendanceEntity } from "./StudentAttendanceEntity";

class StudentAttendanceService extends BaseService {
  async saveSessionAttendance(data: any[], userId: number) {
    const results = [];

    for (const item of data) {
      const existing = (await this.findOneBy({
        classId: item.classId,
        studentId: item.studentId,
        date: item.date,
      })) as StudentAttendanceEntity | null;

      if (!existing) {
        const newRecord = await this.create({
          classId: item.classId,
          studentId: item.studentId,
          date: item.date,
          status: item.status,
          note: item.note,
          createdBy: userId,
        });
        results.push(newRecord);
      } else {
        const isChanged = existing.status !== item.status || (existing.note || "") !== (item.note || "");

        if (isChanged) {
          await this.updateById(existing.id, {
            status: item.status,
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

export default new StudentAttendanceService(StudentAttendanceEntity);

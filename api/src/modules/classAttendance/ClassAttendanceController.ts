import { Request, Response } from "express";

import { AppError, isValidDateString } from "@/utils";
import ClassAttendanceService from "./ClassAttendanceService";

class ClassAttendanceController {
  getClassAttendance = async (req: Request, res: Response) => {
    const classId = Number(req.query.classId);
    if (!Number.isInteger(classId) || classId <= 0) {
      throw AppError.badRequest("Tham số classId không hợp lệ.");
    }

    const date = req.query.date;
    if (!isValidDateString(date)) {
      throw AppError.badRequest("Tham số date phải có dạng YYYY-MM-DD (VD: 2026-09-20).");
    }

    res.success(await ClassAttendanceService.getClassAttendance(classId, date));
  };
}

export default new ClassAttendanceController();

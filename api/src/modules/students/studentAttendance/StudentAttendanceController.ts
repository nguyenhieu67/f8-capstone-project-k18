import { Request, Response } from "express";
import { BaseController } from "@/common";
import StudentAttendanceService from "./StudentAttendanceService";

class StudentAttendanceController extends BaseController {
  saveSessionAttendance = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    if (!userId) return;

    const result = await StudentAttendanceService.saveSessionAttendance(req.body, userId);
    res.success(this.serializeList(result));
  };
}

export default new StudentAttendanceController(StudentAttendanceService);

import { Request, Response } from "express";
import { BaseController } from "@/common";
import StudentAttendanceService from "./StudentAttendanceService";

class StudentAttendanceController extends BaseController {
  saveSessionAttendance = async (req: Request, res: Response) => {
    const updatedBy = this.getUserId(req.auth);

    const data = (req.body as any[]).map((item) => ({
      ...item,
      createdBy: updatedBy,
      updatedBy,
    }));

    res.success(await StudentAttendanceService.saveSessionAttendance(data));
  };
}

export default new StudentAttendanceController(StudentAttendanceService);

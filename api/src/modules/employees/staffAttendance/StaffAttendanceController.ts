import { Request, Response } from "express";
import { BaseController } from "@/common";

import StaffAttendanceService from "./StaffAttendanceService";

class StaffAttendanceController extends BaseController {
  saveSessionAttendance = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    if (!userId) return;

    const result = await StaffAttendanceService.saveSessionAttendance(req.body, userId);
    res.success(this.serializeList(result));
  };
}

export default new StaffAttendanceController(StaffAttendanceService);

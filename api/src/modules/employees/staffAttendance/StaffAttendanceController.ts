import { Request, Response } from "express";
import { BaseController } from "@/common";

import StaffAttendanceService from "./StaffAttendanceService";

class StaffAttendanceController extends BaseController {
  saveSessionAttendance = async (req: Request, res: Response) => {
    const updatedBy = this.getUserId(req);

    const data = (req.body as any[]).map((item) => ({
      ...item,
      createdBy: updatedBy,
      updatedBy,
    }));

    const result = await StaffAttendanceService.saveSessionAttendance(data);
    res.success(this.serializeList(result));
  };
}

export default new StaffAttendanceController(StaffAttendanceService);

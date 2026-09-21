import { Request, Response } from "express";

import { resolveMonth } from "@/utils";
import DashboardService from "./DashboardService";

class DashboardController {
  getDashboard = async (req: Request, res: Response) => {
    const month = resolveMonth(req.query.month);
    res.success(await DashboardService.getDashboard(month));
  };
}

export default new DashboardController();

import { Request, Response } from "express";

import { resolveMonth } from "@/utils";
import PayrollService from "./PayrollService";

class PayrollController {
  getMonthlyPayroll = async (req: Request, res: Response) => {
    const month = resolveMonth(req.query.month);
    res.success(await PayrollService.getMonthlyPayroll(month));
  };
}

export default new PayrollController();

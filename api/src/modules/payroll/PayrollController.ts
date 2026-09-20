import { Request, Response } from "express";

import { AppError } from "@/utils";
import PayrollService from "./PayrollService";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

class PayrollController {
  getMonthlyPayroll = async (req: Request, res: Response) => {
    const queryMonth = typeof req.query.month === "string" ? req.query.month : "";
    const month = queryMonth || PayrollService.getCurrentMonth();

    if (!MONTH_REGEX.test(month)) {
      throw AppError.badRequest("Tham số month phải có dạng YYYY-MM (VD: 2026-09).");
    }

    res.success(await PayrollService.getMonthlyPayroll(month));
  };
}

export default new PayrollController();

import { Request, Response } from "express";

import { resolveOptionalMonth } from "@/utils";
import SaleResultService from "./SaleResultService";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const toPositiveInt = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

class SaleResultController {
  getSaleResults = async (req: Request, res: Response) => {
    const month = resolveOptionalMonth(req.query.month);
    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(toPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);

    res.success(await SaleResultService.getSaleResults({ month, page, limit }));
  };
}

export default new SaleResultController();

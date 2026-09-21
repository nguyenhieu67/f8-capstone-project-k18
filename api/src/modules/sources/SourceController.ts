import { Request, Response } from "express";

import { BaseController } from "@/common";
import SourceService from "./SourceService";

class SourceController extends BaseController {
  getStats = async (_req: Request, res: Response) => {
    const items = await SourceService.getStats();

    res.success({ items, total: items.length });
  };
}

export default new SourceController(SourceService);

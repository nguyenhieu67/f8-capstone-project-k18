import { BaseService } from "@/services/BaseService";
import { Request, Response } from "express";

export abstract class BaseController {
  protected service: BaseService;

  constructor(service: BaseService) {
    this.service = service;
  }

  getList = async (req: Request, res: Response) => {
    res.success(await this.service.getList());
  };

  getOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await this.service.findOneBy({ id });
    if (!item) {
      return res.status(404).send(`Not found with id ${id}`);
    }
    res.success(item);
  };

  create = async (req: Request, res: Response) => {
    res.success(await this.service.create(req.body));
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await this.service.findOneBy({ id });
    if (!existing) {
      return res.status(404).send(`Not found with id ${id}`);
    }
    res.success(await this.service.updateById(id, req.body));
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    res.success(await this.service.deleteById(id));
  };
}

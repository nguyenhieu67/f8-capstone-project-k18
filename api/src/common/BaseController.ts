import { Request, Response } from "express";

import { BaseService } from "./BaseService";
import { constants } from "@/config";

export abstract class BaseController {
  protected service: BaseService;
  protected serialize: (item: any) => any;
  protected serializeList: (items: any[]) => any[];

  constructor(
    service: BaseService,
    serialize: (item: any) => any = (item) => item,
    serializeList?: (items: any[]) => any[],
  ) {
    this.service = service;
    this.serialize = serialize;
    this.serializeList = serializeList ?? ((items) => items.map(this.serialize));
  }

  getList = async (req: Request, res: Response) => {
    res.success(this.serializeList(await this.service.getList()));
  };

  getOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await this.service.findOneBy({ id });
    if (!item) return res.status(constants.httpCodes.notFound).send(`Not found with id ${id}`);
    res.success(this.serialize(item));
  };

  create = async (req: Request, res: Response) => {
    res.success(await this.service.create(req.body));
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await this.service.findOneBy({ id });
    if (!existing) {
      return res.status(constants.httpCodes.notFound).send(`Not found with id ${id}`);
    }
    res.success(await this.service.updateById(id, req.body));
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    res.success(await this.service.deleteById(id));
  };
}

import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";

import { BaseService } from "./BaseService";
import { constants } from "@/config";

export abstract class BaseController {
  protected service: BaseService;
  protected serialize: (item: any) => any;
  protected serializeList: (items: any[]) => any[];
  protected getUserId(req: Request): number | undefined {
    return (req as any).user?.id;
  }
  constructor(
    service: BaseService,
    serialize: (item: any) => any = (item) => instanceToPlain(item),
    serializeList?: (items: any[]) => any[],
  ) {
    this.service = service;
    this.serialize = serialize;
    this.serializeList = serializeList ?? ((items) => items.map(this.serialize));
  }

  getList = async (req: Request, res: Response) => {
    const sortBy = (req.query.sortBy as string) || "id";
    const sortOrder = (req.query.sortOrder as "ASC" | "DESC") || "ASC";
    res.success(this.serializeList(await this.service.getList({}, sortBy, sortOrder)));
  };

  getOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await this.service.findOneBy({ id });
    if (!item) return res.status(constants.httpCodes.notFound).send(`Not found with id ${id}`);
    res.success(this.serialize(item));
  };

  create = async (req: Request, res: Response) => {
    const data = { ...req.body, createdBy: this.getUserId(req) };
    res.success(await this.service.create(data));
  };

  createMany = async (req: Request, res: Response) => {
    const createdBy = this.getUserId(req);
    const data = (req.body as any[]).map((item) => ({ ...item, createdBy }));
    res.success(await this.service.createMany(data));
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existing = await this.service.findOneBy({ id });
    if (!existing) {
      return res.status(constants.httpCodes.notFound).send(`Not found with id ${id}`);
    }
    const data = { ...req.body, updatedBy: this.getUserId(req) };
    res.success(await this.service.updateById(id, data));
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    res.success(await this.service.deleteById(id, this.getUserId(req)));
  };
}

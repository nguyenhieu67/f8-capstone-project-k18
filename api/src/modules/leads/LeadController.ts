import { Request, Response } from "express";

import { BaseController } from "@/common";
import { AppError } from "@/utils";
import { LeadStatus } from "./LeadEntity";
import leadService from "./LeadService";

const MAX_SEARCH_LENGTH = 100;

const SORTABLE_FIELDS = [
  "id",
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "phone",
  "status",
  "sellerId",
  "sourceId",
  "classeId",
];

const optionalString = (value: unknown, name: string) => {
  if (value === undefined || value === "") return undefined;
  if (typeof value !== "string") throw AppError.badRequest(`Tham số ${name} không hợp lệ.`);
  return value;
};

const optionalId = (value: unknown, name: string) => {
  const raw = optionalString(value, name);
  if (raw === undefined) return undefined;

  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw AppError.badRequest(`Tham số ${name} phải là số nguyên dương.`);
  return id;
};

class LeadController extends BaseController {
  getList = async (req: Request, res: Response) => {
    const status = optionalString(req.query.status, "status");
    if (status !== undefined && !Object.values(LeadStatus).includes(status as LeadStatus)) {
      throw AppError.badRequest(`Tham số status phải là một trong: ${Object.values(LeadStatus).join(", ")}.`);
    }

    const search = optionalString(req.query.search, "search")?.trim();
    if (search && search.length > MAX_SEARCH_LENGTH) {
      throw AppError.badRequest(`Tham số search tối đa ${MAX_SEARCH_LENGTH} ký tự.`);
    }

    const sortBy = optionalString(req.query.sortBy, "sortBy") ?? "id";
    if (!SORTABLE_FIELDS.includes(sortBy)) {
      throw AppError.badRequest(`Tham số sortBy phải là một trong: ${SORTABLE_FIELDS.join(", ")}.`);
    }

    const sortOrder = (optionalString(req.query.sortOrder, "sortOrder") ?? "ASC").toUpperCase();
    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      throw AppError.badRequest("Tham số sortOrder phải là ASC hoặc DESC.");
    }

    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const condition = Object.fromEntries(
      Object.entries({
        status,
        sourceId: optionalId(req.query.sourceId, "sourceId"),
        sellerId: optionalId(req.query.sellerId, "sellerId"),
        search,
      }).filter(([, value]) => value !== undefined),
    );

    const { data, total } = await this.service.getList(condition, sortBy, sortOrder, page, limit);

    res.success({
      items: this.serializeList(data),
      total,
      page: page ?? 1,
      limit: limit ?? total,
    });
  };
}

export default new LeadController(leadService);

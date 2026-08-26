import { SelectQueryBuilder } from "typeorm";

import { AppDataSource } from "@/config";
import { BaseEntity } from "./BaseEntity";
import { SimpleEntity } from "./SimpleEntity";

type FkValidator = {
  field: string;
  validate: (value: any) => Promise<void>;
};

export abstract class BaseService {
  private entity: new () => BaseEntity | SimpleEntity;

  protected fkValidators: FkValidator[] = [];
  protected useSoftDelete: boolean = true;

  constructor(entity: new () => BaseEntity | SimpleEntity, useSoftDelete = true) {
    this.entity = entity;
    this.useSoftDelete = useSoftDelete;
  }

  private getTableName() {
    const tableName = AppDataSource.getRepository(this.entity).metadata.tableName;
    return tableName === "order" ? `"${tableName}"` : tableName;
  }

  private async runFkValidators(data: any) {
    for (const v of this.fkValidators) {
      if (data[v.field] !== undefined) {
        await v.validate(data[v.field]);
      }
    }
  }

  private applyActiveCondition(condition: any) {
    return this.useSoftDelete ? { ...condition, isActive: true } : condition;
  }

  private pickEntityColumns<T extends Record<string, any>>(data: T): Partial<T> {
    const validColumns = new Set(
      AppDataSource.getRepository(this.entity).metadata.columns.map((col) => col.propertyName),
    );
    return Object.fromEntries(Object.entries(data).filter(([key]) => validColumns.has(key))) as Partial<T>;
  }

  handleSelect() {
    return AppDataSource.getRepository(this.entity).createQueryBuilder(this.getTableName()).select();
  }

  handleFind(query: SelectQueryBuilder<BaseEntity | SimpleEntity>, condition: any) {
    return query.where(this.applyActiveCondition(condition));
  }

  async getList(condition = {}, sortBy = "id", sortOrder: "ASC" | "DESC" = "ASC") {
    let query = this.handleSelect();
    query = this.handleFind(query, condition);
    query = query.orderBy(`${this.getTableName()}.${sortBy}`, sortOrder);
    return await query.getMany();
  }

  async getById(id: number) {
    return this.findOneBy({ id });
  }

  async findOneBy(condition: Record<string, any>, addSelect: string[] = []) {
    const query = AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .where(this.applyActiveCondition(condition));

    addSelect.forEach((field) => query.addSelect(`${this.getTableName()}.${field}`));

    return await query.getOne();
  }

  async create(data: any) {
    const safeData = this.pickEntityColumns(data);
    await this.runFkValidators(safeData);
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .insert()
      .into(this.entity)
      .values([safeData])
      .returning(["id"])
      .execute();

    const insertedId = query.identifiers[0].id;
    return this.getById(insertedId);
  }

  async createMany(data: any[]) {
    const safeData = data.map((item) => this.pickEntityColumns(item));
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .insert()
      .into(this.entity)
      .values(safeData)
      .returning(["id"])
      .execute();

    return query;
  }

  async updateById(id: number, data: any) {
    const safeData = this.pickEntityColumns(data);
    await this.runFkValidators(safeData);
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .update(safeData)
      .where(`"${this.getTableName()}".id = :id`, { id })
      .returning(["id"])
      .execute();

    return query;
  }

  async deleteById(id: number) {
    if (this.useSoftDelete) {
      const query = await AppDataSource.getRepository(this.entity)
        .createQueryBuilder(this.getTableName())
        .update({ deletedAt: new Date(), isActive: false })
        .where(`"${this.getTableName()}".id = :id`, { id })
        .returning(["id"])
        .execute();

      return query;
    }

    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .delete()
      .where(`"${this.getTableName()}".id = :id`, { id })
      .execute();

    return query;
  }
}

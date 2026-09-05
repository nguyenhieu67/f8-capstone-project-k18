import { In, SelectQueryBuilder } from "typeorm";

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
  protected pickEntityColumns<T extends Record<string, any>>(data: T): Partial<T> {
    const validColumns = new Set(
      AppDataSource.getRepository(this.entity).metadata.columns.map((col) => col.propertyName),
    );
    return Object.fromEntries(Object.entries(data).filter(([key]) => validColumns.has(key))) as Partial<T>;
  }

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

    return AppDataSource.transaction(async (manager) => {
      await Promise.all(safeData.map((item) => this.runFkValidators(item)));

      const repo = manager.getRepository(this.entity);

      const query = await repo
        .createQueryBuilder(this.getTableName())
        .insert()
        .into(this.entity)
        .values(safeData)
        .returning(["id"])
        .execute();

      const insertedIds = query.identifiers.map((identifier) => identifier.id);
      return repo.findBy({ id: In(insertedIds) } as any);
    });
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

  async upsertMany(data: any[], conflictProps: string[], overwriteProps: string[]) {
    if (!data.length) {
      return [];
    }

    const safeData = data.map((item) => ({
      ...this.pickEntityColumns(item),
      updatedAt: new Date(),
    }));

    return AppDataSource.transaction(async (manager) => {
      await Promise.all(safeData.map((item) => this.runFkValidators(item)));

      const repo = manager.getRepository(this.entity);
      const toColumnName = (propertyName: string) =>
        repo.metadata.findColumnWithPropertyName(propertyName)!.databaseName;

      const conflictColumns = conflictProps.map(toColumnName);
      const overwriteColumns = [...overwriteProps, "updatedAt"].map(toColumnName);

      const query = await repo
        .createQueryBuilder()
        .insert()
        .into(this.entity)
        .values(safeData)
        .orUpdate(overwriteColumns, conflictColumns)
        .returning(["id"])
        .execute();

      const ids = query.identifiers.map((identifier) => identifier.id);
      return repo.findBy({ id: In(ids) } as any);
    });
  }

  async deleteById(id: number, deletedBy?: number) {
    if (this.useSoftDelete) {
      const query = await AppDataSource.getRepository(this.entity)
        .createQueryBuilder(this.getTableName())
        .update({ deletedAt: new Date(), deletedBy, isActive: false })
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

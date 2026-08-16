import { SelectQueryBuilder } from "typeorm";

import { AppDataSource } from "@/config/database";
import { BaseEntity } from "@/entities";

type FkValidator = {
  field: string;
  validate: (value: any) => Promise<void>;
};

export abstract class BaseService {
  private entity: new () => BaseEntity;

  protected fkValidators: FkValidator[] = [];

  constructor(entity: new () => BaseEntity) {
    this.entity = entity;
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

  handleSelect() {
    return AppDataSource.getRepository(this.entity).createQueryBuilder(this.getTableName()).select();
  }

  handleFind(query: SelectQueryBuilder<BaseEntity>, condition: any) {
    return query.where({ ...condition, is_active: true });
  }

  async getList(condition = {}) {
    let query = this.handleSelect();
    query = this.handleFind(query, condition);
    return await query.getRawMany();
  }

  async findOneBy(id: number) {
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .where(`${this.getTableName()}.id = :id`, { id })
      .andWhere(`${this.getTableName()}.is_active = :isActive`, {
        isActive: true,
      })
      .getOne();

    return query;
  }

  async create(data: any) {
    await this.runFkValidators(data);
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .insert()
      .into(this.entity)
      .values([data])
      .returning(["id"])
      .execute();

    return query;
  }

  async createMany(data: any) {
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .insert()
      .into(this.entity)
      .values(data)
      .returning(["id"])
      .execute();

    return query;
  }

  async updateById(id: number, data: any) {
    await this.runFkValidators(data);
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .update(data)
      .where(`${this.getTableName()}.id = :id`, { id })
      .returning(["id"])
      .execute();

    return query;
  }

  async deleteById(id: number) {
    const query = await AppDataSource.getRepository(this.entity)
      .createQueryBuilder(this.getTableName())
      .update({
        deleted_at: new Date(),
        is_active: false,
      })
      .where(`${this.getTableName()}.id = :id`, { id })
      .returning(["id"])
      .execute();

    return query;
  }
}

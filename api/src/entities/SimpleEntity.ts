import { PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class SimpleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamptz" })
  created_at!: Date;
}

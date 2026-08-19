import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamptz" })
  created_at!: Date;

  @Column({ type: "int", nullable: true })
  created_by!: number;

  @Column({ type: "timestamptz", nullable: true })
  updated_at!: Date;

  @Column({ type: "int", nullable: true })
  updated_by!: number;

  @Column({ type: "timestamptz", nullable: true })
  deleted_at?: Date;

  @Column({ type: "int", nullable: true })
  deleted_by?: number;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;
}

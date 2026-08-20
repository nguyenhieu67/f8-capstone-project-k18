import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamptz" })
  createdAt!: Date;

  @Column({ type: "int", nullable: true })
  createdBy!: number;

  @Column({ type: "timestamptz", nullable: true })
  updatedAt!: Date;

  @Column({ type: "int", nullable: true })
  updatedBy!: number;

  @Column({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @Column({ type: "int", nullable: true })
  deletedBy?: number;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}

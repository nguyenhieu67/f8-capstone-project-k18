import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Exclude()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Exclude()
  @Column({ type: "int", nullable: true })
  createdBy!: number;

  @Exclude()
  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt!: Date;

  @Exclude()
  @Column({ type: "int", nullable: true })
  updatedBy!: number;

  @Exclude()
  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @Exclude()
  @Column({ type: "int", nullable: true })
  deletedBy?: number;

  @Exclude()
  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}

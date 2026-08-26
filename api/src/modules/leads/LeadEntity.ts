import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";
import { Expose } from "class-transformer";

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  CONVERTED = "converted",
  LOST = "lost",
}

@Entity("lead")
export class LeadEntity extends BaseEntity {
  @Column({ type: "bigint" })
  sellerId!: number;

  @Column({ type: "bigint" })
  sourceId!: number;

  @Column({ type: "text" })
  firstName!: string;

  @Column({ type: "text" })
  lastName!: string;

  @Column({ type: "text" })
  phone?: string;

  @Column({ type: "text" })
  purpose?: string;

  @Column({ type: "text" })
  who?: string;

  @Column({
    type: "enum",
    enum: LeadStatus,
    enumName: "lead_status",
  })
  status?: LeadStatus;

  @Column({ type: "text" })
  rejectionReason?: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

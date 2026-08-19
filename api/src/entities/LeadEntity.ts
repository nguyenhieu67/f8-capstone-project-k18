import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

export enum LeadStatus {
  NEW = "new",
  CONVERTED = "converted",
  REJECTED = "rejected",
}

@Entity("lead")
export class LeadEntity extends BaseEntity {
  @Column({ type: "bigint" })
  seller_id!: number;

  @Column({ type: "bigint" })
  source_id!: number;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

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
  rejection_reason?: string;
}

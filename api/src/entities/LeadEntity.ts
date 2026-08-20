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
}

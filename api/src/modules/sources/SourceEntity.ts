import { Entity, Column } from "typeorm";

import { BaseEntity } from "@/common";

export enum SourceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("source")
export class SourceEntity extends BaseEntity {
  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  color?: string;

  @Column({ type: "text" })
  icon?: string;

  @Column({
    type: "enum",
    enum: SourceStatus,
    enumName: "source_status",
  })
  status?: SourceStatus;
}

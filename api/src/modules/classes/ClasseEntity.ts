import { BaseEntity } from "@/common";

import { Entity, Column } from "typeorm";

export enum ClasseStatus {
  OPENING = "opening",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CLOSED = "closed",
}

@Entity("classe")
export class ClasseEntity extends BaseEntity {
  @Column({ type: "bigint" })
  trainerId!: number;

  @Column({ type: "text" })
  code!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  schedule?: string;

  @Column({
    type: "enum",
    enum: ClasseStatus,
    enumName: "classe_status",
  })
  status?: ClasseStatus;

  @Column({ type: "int" })
  tuition?: number;
}

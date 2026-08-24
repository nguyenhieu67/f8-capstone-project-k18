import { BaseEntity } from "@/common";

import { Entity, Column } from "typeorm";

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

  @Column({ type: "int" })
  tuition?: number;
}

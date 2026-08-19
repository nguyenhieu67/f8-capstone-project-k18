import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

@Entity("classe")
export class ClasseEntity extends BaseEntity {
  @Column({ type: "bigint" })
  trainer_id!: number;

  @Column({ type: "text" })
  code!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  schedule?: string;

  @Column({ type: "int" })
  tuition?: number;
}

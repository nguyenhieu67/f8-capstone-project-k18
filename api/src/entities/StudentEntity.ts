import { Entity, Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

@Entity("student")
export class StudentEntity extends BaseEntity {
  @Column({ type: "bigint" })
  lead_id!: number;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({ type: "text" })
  phone?: string;

  @Column({ type: "int" })
  revenue?: number;

  @Column({ type: "timestamptz" })
  enrolled_at?: Date;
}

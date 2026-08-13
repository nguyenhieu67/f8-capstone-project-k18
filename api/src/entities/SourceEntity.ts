import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("source")
export class SourceEntity extends BaseEntity {
  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  color?: string;

  @Column({ type: "text" })
  icon?: string;
}

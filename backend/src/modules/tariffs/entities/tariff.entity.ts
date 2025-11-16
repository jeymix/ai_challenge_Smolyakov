import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("tariffs")
@Unique(["month"])
export class Tariff {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  month: number; // 1-12

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerKmUnder1000: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerKmOver1000: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


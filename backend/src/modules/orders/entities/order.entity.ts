import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { City } from "../../cities/entities/city.entity";

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  MANUAL = "manual",
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @Column()
  carBrand: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: "cityFromId" })
  cityFrom: City;

  @Column()
  cityFromId: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: "cityToId" })
  cityTo: City;

  @Column()
  cityToId: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  distance: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  appliedTariff: number;

  @Column({ default: false })
  isFixedRoute: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  transportPrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  insurancePrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: "int" })
  durationHours: number;

  @Column({ type: "int" })
  durationDays: number;

  @Column({ type: "date" })
  estimatedArrivalDate: Date;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


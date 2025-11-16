import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "../../orders/entities/order.entity";

@Entity("cities")
export class City {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.cityFrom)
  ordersFrom: Order[];

  @OneToMany(() => Order, (order) => order.cityTo)
  ordersTo: Order[];
}


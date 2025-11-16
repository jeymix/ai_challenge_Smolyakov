import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Order } from "./entities/order.entity";
import { PriceCalculatorService } from "./calculators/price-calculator.service";
import { TariffsModule } from "../tariffs/tariffs.module";
import { CitiesModule } from "../cities/cities.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TariffsModule,
    CitiesModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PriceCalculatorService],
  exports: [OrdersService],
})
export class OrdersModule {}


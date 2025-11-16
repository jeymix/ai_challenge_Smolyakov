import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitiesController } from "./cities.controller";
import { AdminCitiesController } from "./admin-cities.controller";
import { CitiesService } from "./cities.service";
import { City } from "./entities/city.entity";
import { Order } from "../orders/entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([City, Order])],
  controllers: [CitiesController, AdminCitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}


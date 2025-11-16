import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TariffsController } from "./tariffs.controller";
import { AdminTariffsController } from "./admin-tariffs.controller";
import { TariffsService } from "./tariffs.service";
import { Tariff } from "./entities/tariff.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tariff])],
  controllers: [TariffsController, AdminTariffsController],
  providers: [TariffsService],
  exports: [TariffsService],
})
export class TariffsModule {}


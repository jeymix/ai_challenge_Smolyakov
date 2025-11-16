import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CitiesModule } from "./modules/cities/cities.module";
import { TariffsModule } from "./modules/tariffs/tariffs.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { HealthModule } from "./modules/health/health.module";
import { dataSourceOptions } from "./config/data-source";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    CitiesModule,
    TariffsModule,
    OrdersModule,
    PaymentModule,
    HealthModule,
  ],
})
export class AppModule {}


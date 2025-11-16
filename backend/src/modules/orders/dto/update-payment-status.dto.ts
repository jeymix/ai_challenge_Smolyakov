import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "../entities/order.entity";

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}


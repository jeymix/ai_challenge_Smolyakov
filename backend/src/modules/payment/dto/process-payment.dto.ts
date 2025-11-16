import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProcessPaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty({ required: false })
  cardData?: {
    number: string;
    expiry: string;
    cvv: string;
    holderName: string;
  };
}


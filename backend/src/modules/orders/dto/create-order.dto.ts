import { IsString, IsUUID, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CalculateOrderDto } from "./calculate-order.dto";

export class CreateOrderDto extends CalculateOrderDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}


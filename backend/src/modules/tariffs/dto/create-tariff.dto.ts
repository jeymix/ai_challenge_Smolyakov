import { IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTariffDto {
  @ApiProperty({ example: 1, minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  pricePerKmUnder1000: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  pricePerKmOver1000: number;
}


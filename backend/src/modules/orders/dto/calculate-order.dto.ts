import { IsString, IsUUID, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CalculateOrderDto {
  @ApiProperty({ example: "BMW X5" })
  @IsString()
  carBrand: string;

  @ApiProperty()
  @IsUUID()
  cityFromId: string;

  @ApiProperty()
  @IsUUID()
  cityToId: string;

  @ApiProperty({ example: "2024-01-15" })
  @IsDateString()
  startDate: string;
}


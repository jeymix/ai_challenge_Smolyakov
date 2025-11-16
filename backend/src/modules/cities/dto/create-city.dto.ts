import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCityDto {
  @ApiProperty({ example: "Москва" })
  @IsString()
  @IsNotEmpty()
  name: string;
}


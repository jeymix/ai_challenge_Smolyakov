import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminLoginDto {
  @ApiProperty({ example: "admin" })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: "admin123" })
  @IsString()
  @IsNotEmpty()
  password: string;
}


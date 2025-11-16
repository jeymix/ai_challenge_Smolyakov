import { IsString, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Иванов Иван Иванович" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "+79991234567" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Некорректный формат телефона",
  })
  phone: string;
}


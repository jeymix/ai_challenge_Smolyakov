import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Создать пользователя" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("by-phone")
  @ApiOperation({ summary: "Найти пользователя по телефону" })
  async findByPhone(@Query("phone") phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    return user;
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить пользователя по ID" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}


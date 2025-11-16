import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TariffsService } from "./tariffs.service";

@ApiTags("tariffs")
@Controller("tariffs")
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get()
  @ApiOperation({ summary: "Получить все тарифы" })
  findAll() {
    return this.tariffsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить тариф по ID" })
  findOne(@Param("id") id: string) {
    return this.tariffsService.findOne(id);
  }
}


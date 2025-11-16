import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { TariffsService } from "./tariffs.service";
import { CreateTariffDto } from "./dto/create-tariff.dto";
import { UpdateTariffDto } from "./dto/update-tariff.dto";
import { AdminGuard } from "../auth/guards/admin.guard";

@ApiTags("admin-tariffs")
@Controller("admin/tariffs")
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminTariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get()
  @ApiOperation({ summary: "Получить все тарифы (админ)" })
  findAll() {
    return this.tariffsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить тариф по ID (админ)" })
  findOne(@Param("id") id: string) {
    return this.tariffsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Создать тариф (админ)" })
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffsService.create(createTariffDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Обновить тариф (админ)" })
  update(@Param("id") id: string, @Body() updateTariffDto: UpdateTariffDto) {
    return this.tariffsService.update(id, updateTariffDto);
  }
}


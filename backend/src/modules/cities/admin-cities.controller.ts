import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CitiesService } from "./cities.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { AdminGuard } from "../auth/guards/admin.guard";

@ApiTags("admin-cities")
@Controller("admin/cities")
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminCitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: "Получить все города (админ)" })
  findAll() {
    return this.citiesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Создать город (админ)" })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Обновить город (админ)" })
  update(@Param("id") id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Удалить город (админ)" })
  remove(@Param("id") id: string) {
    return this.citiesService.remove(id);
  }
}


import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CitiesService } from "./cities.service";

@ApiTags("cities")
@Controller("cities")
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: "Получить список всех городов" })
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить город по ID" })
  findOne(@Param("id") id: string) {
    return this.citiesService.findOne(id);
  }
}


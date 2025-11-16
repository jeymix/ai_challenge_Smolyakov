import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { City } from "./entities/city.entity";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { Order } from "../orders/entities/order.entity";

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async findAll(): Promise<City[]> {
    return this.citiesRepository.find({
      order: { name: "ASC" },
    });
  }

  async findOne(id: string): Promise<City> {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }
    return city;
  }

  async create(createCityDto: CreateCityDto): Promise<City> {
    const city = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(city);
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);
    Object.assign(city, updateCityDto);
    return this.citiesRepository.save(city);
  }

  async remove(id: string): Promise<void> {
    const city = await this.findOne(id);

    // Проверяем, есть ли заказы с этим городом
    const ordersWithCity = await this.ordersRepository.count({
      where: [
        { cityFromId: id },
        { cityToId: id },
      ],
    });

    if (ordersWithCity > 0) {
      throw new BadRequestException(
        `Невозможно удалить город: существует ${ordersWithCity} заказ(ов) с этим городом`
      );
    }

    await this.citiesRepository.remove(city);
  }
}


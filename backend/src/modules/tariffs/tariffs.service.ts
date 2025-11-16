import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tariff } from "./entities/tariff.entity";
import { UpdateTariffDto } from "./dto/update-tariff.dto";
import { CreateTariffDto } from "./dto/create-tariff.dto";

@Injectable()
export class TariffsService {
  constructor(
    @InjectRepository(Tariff)
    private tariffsRepository: Repository<Tariff>
  ) {}

  async findAll(): Promise<Tariff[]> {
    return this.tariffsRepository.find({
      order: { month: "ASC" },
    });
  }

  async findOne(id: string): Promise<Tariff> {
    const tariff = await this.tariffsRepository.findOne({ where: { id } });
    if (!tariff) {
      throw new NotFoundException(`Тариф с ID ${id} не найден`);
    }
    return tariff;
  }

  async findByMonth(month: number): Promise<Tariff | null> {
    return this.tariffsRepository.findOne({ where: { month } });
  }

  async create(createTariffDto: CreateTariffDto): Promise<Tariff> {
    const tariff = this.tariffsRepository.create(createTariffDto);
    return this.tariffsRepository.save(tariff);
  }

  async update(id: string, updateTariffDto: UpdateTariffDto): Promise<Tariff> {
    const tariff = await this.findOne(id);
    Object.assign(tariff, updateTariffDto);
    return this.tariffsRepository.save(tariff);
  }
}


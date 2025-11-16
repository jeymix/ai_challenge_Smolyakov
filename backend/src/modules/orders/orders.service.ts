import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, PaymentStatus } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CalculateOrderDto } from "./dto/calculate-order.dto";
import { PriceCalculatorService } from "./calculators/price-calculator.service";
import { CitiesService } from "../cities/cities.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private priceCalculatorService: PriceCalculatorService,
    private citiesService: CitiesService,
    private usersService: UsersService
  ) {}

  async calculate(calculateOrderDto: CalculateOrderDto) {
    const cityFrom = await this.citiesService.findOne(
      calculateOrderDto.cityFromId
    );
    const cityTo = await this.citiesService.findOne(calculateOrderDto.cityToId);

    const startDate = new Date(calculateOrderDto.startDate);

    return this.priceCalculatorService.calculate(
      cityFrom.name,
      cityTo.name,
      startDate
    );
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersService.findOne(createOrderDto.userId);
    const cityFrom = await this.citiesService.findOne(createOrderDto.cityFromId);
    const cityTo = await this.citiesService.findOne(createOrderDto.cityToId);

    const calculation = await this.priceCalculatorService.calculate(
      cityFrom.name,
      cityTo.name,
      new Date(createOrderDto.startDate)
    );

    const order = this.ordersRepository.create({
      ...createOrderDto,
      ...calculation,
      startDate: new Date(createOrderDto.startDate),
    });

    return this.ordersRepository.save(order);
  }

  async findAll(filters?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    cityFromId?: string;
    cityToId?: string;
    paymentStatus?: PaymentStatus;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    page?: number;
    limit?: number;
  }) {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.cityFrom", "cityFrom")
      .leftJoinAndSelect("order.cityTo", "cityTo");

    if (filters?.cityFromId) {
      queryBuilder.andWhere("order.cityFromId = :cityFromId", {
        cityFromId: filters.cityFromId,
      });
    }

    if (filters?.cityToId) {
      queryBuilder.andWhere("order.cityToId = :cityToId", {
        cityToId: filters.cityToId,
      });
    }

    if (filters?.paymentStatus) {
      queryBuilder.andWhere("order.paymentStatus = :paymentStatus", {
        paymentStatus: filters.paymentStatus,
      });
    }

    if (filters?.date) {
      const date = new Date(filters.date);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      queryBuilder.andWhere("order.startDate BETWEEN :startDate AND :endDate", {
        startDate: startOfDay,
        endDate: endOfDay,
      });
    } else if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere("order.startDate BETWEEN :startDate AND :endDate", {
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
      });
    }

    if (filters?.sortBy) {
      const order = filters.sortOrder || "ASC";
      if (filters.sortBy === "date") {
        queryBuilder.orderBy("order.startDate", order);
      } else if (filters.sortBy === "price") {
        queryBuilder.orderBy("order.totalPrice", order);
      }
    } else {
      queryBuilder.orderBy("order.createdAt", "DESC");
    }

    if (filters?.page && filters?.limit) {
      queryBuilder.skip((filters.page - 1) * filters.limit);
      queryBuilder.take(filters.limit);
    }

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
      page: filters?.page || 1,
      limit: filters?.limit || orders.length,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["user", "cityFrom", "cityTo"],
    });

    if (!order) {
      throw new NotFoundException(`Заказ с ID ${id} не найден`);
    }

    return order;
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    return this.ordersRepository.save(order);
  }
}


import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CalculateOrderDto } from "./dto/calculate-order.dto";
import { UpdatePaymentStatusDto } from "./dto/update-payment-status.dto";
import { AdminGuard } from "../auth/guards/admin.guard";
import { PaymentStatus } from "./entities/order.entity";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("calculate")
  @ApiOperation({ summary: "Рассчитать стоимость перевозки" })
  calculate(@Body() calculateOrderDto: CalculateOrderDto) {
    return this.ordersService.calculate(calculateOrderDto);
  }

  @Post()
  @ApiOperation({ summary: "Создать заказ" })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить заказ по ID" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Get("admin/list")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Получить реестр заказов (админ)" })
  findAllAdmin(
    @Query("date") date?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("cityFromId") cityFromId?: string,
    @Query("cityToId") cityToId?: string,
    @Query("paymentStatus") paymentStatus?: PaymentStatus,
    @Query("sortBy") sortBy?: string,
    @Query("sortOrder") sortOrder?: "ASC" | "DESC",
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.ordersService.findAll({
      date,
      startDate,
      endDate,
      cityFromId,
      cityToId,
      paymentStatus,
      sortBy,
      sortOrder,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Patch("admin/:id/payment-status")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Изменить статус оплаты (админ)" })
  updatePaymentStatusAdmin(
    @Param("id") id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto
  ) {
    return this.ordersService.updatePaymentStatus(
      id,
      updatePaymentStatusDto.paymentStatus
    );
  }
}


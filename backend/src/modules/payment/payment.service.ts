import { Injectable } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { PaymentStatus } from "../orders/entities/order.entity";

@Injectable()
export class PaymentService {
  constructor(private ordersService: OrdersService) {}

  async processPayment(orderId: string): Promise<{ success: boolean; orderId: string }> {
    // findOne уже выбрасывает NotFoundException если заказ не найден
    await this.ordersService.findOne(orderId);

    // Симуляция оплаты - всегда успешна
    await this.ordersService.updatePaymentStatus(orderId, PaymentStatus.PAID);

    return {
      success: true,
      orderId,
    };
  }
}


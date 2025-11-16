import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { ProcessPaymentDto } from "./dto/process-payment.dto";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("process")
  @ApiOperation({ summary: "Обработать оплату (симулятор)" })
  processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentService.processPayment(processPaymentDto.orderId);
  }
}


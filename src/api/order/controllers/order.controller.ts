import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from 'src/api/order/services/order.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';

class CreateOrderDto {
  public productVariationId: number;
  public countryCode: string;
  public quantity: number;
}

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() body: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.orderService.createOrder(
      userId,
      body.productVariationId,
      body.countryCode,
      body.quantity,
    );
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(+id);
  }
}

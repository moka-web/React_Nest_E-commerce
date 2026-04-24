import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { OrderService } from 'src/api/order/services/order.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';

class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'Product variation ID' })
  public productVariationId: number;

  @ApiProperty({
    example: 'AR',
    description: 'Country code (ISO 3166-1 alpha-2)',
  })
  public countryCode: string;

  @ApiProperty({ example: 1, description: 'Quantity to order' })
  public quantity: number;
}

@ApiTags('orders')
@ApiBearerAuth()
@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Create a new order and reserve stock',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient stock',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({
    summary: 'Get all orders',
    description: 'Returns all orders for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.id;
    return this.orderService.findByUser(userId);
  }

  @ApiOperation({
    summary: 'Cancel an order',
    description: 'Cancel an existing order and release reserved stock',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Order already cancelled' })
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(+id);
  }
}

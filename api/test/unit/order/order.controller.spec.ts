import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/api/order/controllers/order.controller';
import { OrderService } from '../../../src/api/order/services/order.service';
import { AuthGuard } from '../../../src/api/auth/guards/auth.guard';
import { mockGuard } from '../../mocks/guards';

describe('OrderController', () => {
  let controller: OrderController;
  let fakeOrderService: Partial<OrderService>;
  const mockOrder = { id: 1, status: 'PENDING' };

  beforeEach(async () => {
    fakeOrderService = {
      createOrder: jest.fn().mockResolvedValue(mockOrder),
      cancelOrder: jest.fn().mockResolvedValue({ id: 1, status: 'CANCELLED' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: fakeOrderService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create order', async () => {
      const body = { productVariationId: 10, countryCode: 'AR', quantity: 2 };
      const req = { user: { id: 1 } };
      const result = await controller.create(body, req);

      expect(fakeOrderService.createOrder).toBeCalledWith(
        req.user.id,
        body.productVariationId,
        body.countryCode,
        body.quantity,
      );
      expect(result).toHaveProperty('id');
    });
  });

  describe('cancel', () => {
    it('should cancel order', async () => {
      const result = await controller.cancel('1');

      expect(fakeOrderService.cancelOrder).toBeCalledWith(1);
      expect(result).toHaveProperty('status', 'CANCELLED');
    });
  });
});

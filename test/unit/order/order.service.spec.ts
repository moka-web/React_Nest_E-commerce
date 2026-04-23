import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EventEmitter } from '../../../src/core/event-emitter.service';
import { EntityManager } from 'typeorm';
import {
  Order,
  OrderStatus,
} from '../../../src/database/entities/order.entity';
import { InventoryService } from '../../../src/api/inventory/services/inventory.service';
import { OrderService } from '../../../src/api/order/services/order.service';

describe('OrderService', () => {
  let service: OrderService;
  let fakeEntityManager: Partial<EntityManager>;
  let fakeEventEmitter: Partial<EventEmitter>;
  let fakeInventoryService: Partial<InventoryService>;

  const mockOrder = {
    id: 1,
    userId: 1,
    productVariationId: 10,
    countryCode: 'AR',
    quantity: 2,
    status: OrderStatus.PENDING,
  } as Order;

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeEntityManager = {
      create: jest.fn().mockReturnValue(mockOrder),
      save: jest.fn().mockResolvedValue(mockOrder),
      findOne: jest.fn().mockResolvedValue(mockOrder),
    };
    fakeEventEmitter = {
      createEvent: jest.fn().mockReturnValue({}),
      emit: jest.fn().mockResolvedValue(undefined),
    };
    fakeInventoryService = {
      reserveStock: jest.fn().mockResolvedValue({}),
      releaseStock: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getEntityManagerToken(),
          useValue: fakeEntityManager,
        },
        {
          provide: EventEmitter,
          useValue: fakeEventEmitter,
        },
        {
          provide: InventoryService,
          useValue: fakeInventoryService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order and reserve stock', async () => {
      const result = await service.createOrder(1, 10, 'AR', 2);

      expect(fakeInventoryService.reserveStock).toBeCalledWith(10, 'AR', 2);
      expect(fakeEntityManager.create).toBeCalled();
      expect(fakeEntityManager.save).toBeCalled();
      expect(fakeEventEmitter.createEvent).toBeCalled();
      expect(fakeEventEmitter.emit).toBeCalled();
      expect(result.id).toBe(mockOrder.id);
    });
  });

  describe('cancelOrder', () => {
    it('should throw error if order not found', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.cancelOrder(1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError('Order not found');
    });

    it('should throw error if already cancelled', async () => {
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELLED };
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(cancelledOrder);
      const result = service.cancelOrder(1);

      expect(result).rejects.toThrowError('Order already cancelled');
    });

    it('should cancel order and release stock', async () => {
      const result = await service.cancelOrder(1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeInventoryService.releaseStock).toBeCalledWith(
        mockOrder.productVariationId,
        mockOrder.countryCode,
        mockOrder.quantity,
      );
      expect(fakeEntityManager.save).toBeCalled();
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });
  });
});

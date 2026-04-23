import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EventEmitter } from '../../../src/core/event-emitter.service';
import { EntityManager } from 'typeorm';
import { Inventory } from '../../../src/database/entities/inventory.entity';
import { InventoryService } from '../../../src/api/inventory/services/inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let fakeEntityManager: Partial<EntityManager>;
  let fakeEventEmitter: Partial<EventEmitter>;

  const mockInventory = {
    id: 1,
    productVariationId: 10,
    countryCode: 'AR',
    quantity: 100,
  } as Inventory;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create a fresh copy for each test to avoid mutation issues
    const freshInventory = { ...mockInventory };
    fakeEntityManager = {
      findOne: jest.fn().mockResolvedValue(freshInventory),
      save: jest.fn().mockImplementation((inv) => Promise.resolve(inv)),
    };
    fakeEventEmitter = {
      createEvent: jest.fn().mockReturnValue({}),
      emit: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getEntityManagerToken(),
          useValue: fakeEntityManager,
        },
        {
          provide: EventEmitter,
          useValue: fakeEventEmitter,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveStock', () => {
    it('should throw error if inventory not found', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.reserveStock(10, 'AR', 2);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError('Inventory not found');
    });

    it('should throw error if insufficient stock', async () => {
      const lowInventory = { ...mockInventory, quantity: 1 };
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(lowInventory);
      const result = service.reserveStock(10, 'AR', 5);

      expect(result).rejects.toThrowError('Insufficient stock');
    });

    it('should decrement stock and return inventory', async () => {
      const result = await service.reserveStock(10, 'AR', 2);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.save).toBeCalled();
      expect(result.quantity).toBe(98);
    });
  });

  describe('releaseStock', () => {
    it('should throw error if inventory not found', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.releaseStock(10, 'AR', 2);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError('Inventory not found');
    });

    it('should increment stock and return inventory', async () => {
      // Create a fresh copy for this specific test
      const freshInventory = { ...mockInventory, quantity: 100 };
      (fakeEntityManager.findOne as jest.Mock).mockResolvedValue(
        freshInventory,
      );
      const result = await service.releaseStock(10, 'AR', 2);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.save).toBeCalled();
      expect(result.quantity).toBe(102);
    });
  });

  describe('getStock', () => {
    it('should return current quantity', async () => {
      const result = await service.getStock(10, 'AR');
      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).toBe(100);
    });

    it('should return 0 if inventory not found', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = await service.getStock(10, 'AR');
      expect(result).toBe(0);
    });
  });
});

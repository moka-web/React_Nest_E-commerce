import { Test, TestingModule } from '@nestjs/testing';
import { successObject } from '../../../src/common/helper/sucess-response.interceptor';
import {
  Categories,
  Category,
  CategoryIds,
} from '../../../src/database/entities/category.entity';
import {
  Product,
  VariationTypes,
} from '../../../src/database/entities/product.entity';
import { errorMessages } from '../../../src/errors/custom';
import { EventEmitter } from '../../../src/core/event-emitter.service';
import { ProductRepository } from '../../../src/api/product/repositories/product.repository';
import { ProductService } from '../../../src/api/product/services/product.service';
import { ComputerDetails } from '../../../src/api/product/dto/productDetails/computer.details';
import { ProductDetailsDto } from '../../../src/api/product/dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let fakeProductRepository: Partial<ProductRepository>;
  let fakeEventEmitter: Partial<EventEmitter>;

  const computersCategory = {
    id: CategoryIds.Computers,
    name: Categories.Computers,
  } as Category;

  const testProduct = {
    id: 1,
    title: 'test title',
    category: computersCategory,
    merchantId: 1,
  } as Product;

  const fulfilledProduct = {
    id: 3,
    title: 'test title',
    description: 'description 1',
    about: ['about 1'],
    details: {
      brand: 'Dell',
      series: 'XPS',
      capacity: 2,
      category: 'Computers',
      capacityType: 'HD',
      capacityUnit: 'TB',
    },
    isActive: true,
    merchantId: 1,
    categoryId: 1,
  };

  const computerDetails: ComputerDetails = {
    category: Categories.Computers,
    capacity: 2,
    capacityUnit: 'TB',
    capacityType: 'HD',
    brand: 'Dell',
    series: 'XPS',
  };

  const productDetails: ProductDetailsDto = {
    details: computerDetails,
    about: ['about 1'],
    description: 'test description',
    code: 'test UPC code',
    title: 'test title',
    variationType: VariationTypes.NONE,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeProductRepository = {
      findOneById: jest.fn().mockResolvedValue(testProduct),
      findCategoryById: jest.fn().mockResolvedValue(computersCategory),
      createProduct: jest.fn().mockResolvedValue(testProduct),
      updateProduct: jest
        .fn()
        .mockResolvedValue({ affected: 1, raw: [testProduct] }),
      activateProduct: jest
        .fn()
        .mockResolvedValue({ affected: 1, raw: [{ id: 1, isActive: true }] }),
      deleteProduct: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    fakeEventEmitter = {
      createEvent: jest.fn().mockReturnValue({}),
      emit: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: fakeProductRepository,
        },
        {
          provide: EventEmitter,
          useValue: fakeEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProduct', () => {
    it('should throw not found when product does not exist', async () => {
      (fakeProductRepository.findOneById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.getProduct(1)).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
      expect(fakeProductRepository.findOneById).toBeCalledWith(1);
    });

    it('should return product when found', async () => {
      fakeProductRepository.findOneById = jest
        .fn()
        .mockResolvedValue(testProduct);
      const result = await service.getProduct(1);

      expect(fakeProductRepository.findOneById).toBeCalledWith(1);
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('createProduct', () => {
    it('should throw not found when category does not exist', async () => {
      (fakeProductRepository.findCategoryById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.createProduct({ categoryId: 1 }, 1),
      ).rejects.toThrowError(errorMessages.category.notFound.message);
      expect(fakeProductRepository.findCategoryById).toBeCalled();
    });

    it('should create product and emit event', async () => {
      const result = await service.createProduct({ categoryId: 1 }, 1);

      expect(fakeProductRepository.findCategoryById).toBeCalled();
      expect(fakeProductRepository.createProduct).toBeCalled();
      expect(fakeEventEmitter.createEvent).toBeCalled();
      expect(fakeEventEmitter.emit).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('addProductDetails', () => {
    it('should update product details', async () => {
      const result = await service.addProductDetails(1, productDetails, 1);

      expect(fakeProductRepository.updateProduct).toBeCalledWith(
        1,
        1,
        productDetails,
      );
      expect(result).toBeDefined();
    });
  });

  describe('activateProduct', () => {
    it('should throw not found when product does not exist', async () => {
      (fakeProductRepository.findOneById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.activateProduct(1, 1)).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
      expect(fakeProductRepository.findOneById).toBeCalledWith(1);
    });

    it('should throw error if product not fulfilled', async () => {
      // Mock validate to return validation errors since entity has no decorators
      jest.spyOn(service as any, 'validate').mockResolvedValue(false);

      await expect(service.activateProduct(1, 1)).rejects.toThrowError(
        errorMessages.product.notFulfilled.message,
      );
    });

    it('should activate product when fulfilled', async () => {
      (fakeProductRepository.findOneById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(fulfilledProduct);
      (fakeProductRepository.activateProduct as jest.Mock) = jest
        .fn()
        .mockResolvedValue(fulfilledProduct);
      const result = await service.activateProduct(1, 1);

      expect(fakeProductRepository.findOneById).toHaveBeenCalled();
      expect(fakeProductRepository.activateProduct).toHaveBeenCalledWith(1, 1);
      expect(result.id).toBe(fulfilledProduct.id);
      expect(result.isActive).toBe(true);
    });
  });

  describe('deleteProduct', () => {
    it('should throw not found when product does not exist', async () => {
      (fakeProductRepository.deleteProduct as jest.Mock) = jest
        .fn()
        .mockResolvedValue({ affected: 0 });

      await expect(service.deleteProduct(1, 1)).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
      expect(fakeProductRepository.deleteProduct).toBeCalledWith(1, 1);
    });

    it('should delete product and return success', async () => {
      fakeProductRepository.deleteProduct = jest
        .fn()
        .mockResolvedValue({ affected: 1 });
      const result = await service.deleteProduct(1, 1);

      expect(fakeProductRepository.deleteProduct).toBeCalledWith(1, 1);
      expect(result).toEqual(successObject);
    });
  });
});

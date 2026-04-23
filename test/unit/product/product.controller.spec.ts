import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../src/api/product/controllers/product.controller';
import { ProductService } from '../../../src/api/product/services/product.service';
import { AuthGuard } from '../../../src/api/auth/guards/auth.guard';
import { RolesGuard } from '../../../src/api/auth/guards/roles.guard';
import { User } from '../../../src/database/entities/user.entity';
import { mockGuard } from '../../mocks/guards';

describe('ProductController', () => {
  let controller: ProductController;
  let fakeProductService: Partial<ProductService>;
  const mockProduct = { id: 1, title: 'Test Product' };
  const mockUser = { id: 1 } as User;

  beforeEach(async () => {
    fakeProductService = {
      getProduct: jest.fn().mockResolvedValue(mockProduct),
      createProduct: jest.fn().mockResolvedValue({ id: 1 }),
      addProductDetails: jest.fn().mockResolvedValue(mockProduct),
      activateProduct: jest.fn().mockResolvedValue({ id: 1, isActive: true }),
      deleteProduct: jest.fn().mockResolvedValue({ message: 'success' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: fakeProductService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProduct', () => {
    it('should return product by id', async () => {
      const result = await controller.getProduct({ id: 1 });
      expect(fakeProductService.getProduct).toBeCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create and return product', async () => {
      const body = { categoryId: 1, title: 'New Product' };
      const result = await controller.createProduct(body, mockUser);
      expect(fakeProductService.createProduct).toBeCalledWith(
        body,
        mockUser.id,
      );
      expect(result).toHaveProperty('id');
    });
  });

  describe('addProductDetails', () => {
    it('should add details and return product', async () => {
      const params = { id: 1 };
      const body = {
        title: 'Product',
        code: '123',
        description: 'desc',
        variationType: 'NONE' as any,
        about: [],
        details: {} as any,
      };
      const result = await controller.addProductDetails(params, body, mockUser);
      expect(fakeProductService.addProductDetails).toBeCalledWith(
        params.id,
        body,
        mockUser.id,
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('activateProduct', () => {
    it('should activate product', async () => {
      const params = { id: 1 };
      const result = await controller.activateProduct(params, mockUser);
      expect(fakeProductService.activateProduct).toBeCalledWith(
        params.id,
        mockUser.id,
      );
      expect(result).toHaveProperty('isActive', true);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const params = { id: 1 };
      const result = await controller.deleteProduct(params, mockUser);
      expect(fakeProductService.deleteProduct).toBeCalledWith(
        params.id,
        mockUser.id,
      );
      expect(result).toHaveProperty('message', 'success');
    });
  });
});

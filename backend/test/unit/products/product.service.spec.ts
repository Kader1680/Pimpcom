import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from '../../../src/products/products.service';
import { Product } from '../../../src/products/entities/product.entity';

describe('ProductsService', () => {
  let productsService: ProductsService;

  const mockProductsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
    decrement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });
});
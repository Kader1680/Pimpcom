import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const existing = await this.productsRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Product with this name/slug already exists');

    const product = this.productsRepo.create({ ...dto, slug });
    return this.productsRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;

    const qb = this.productsRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (query.search) {
      qb.andWhere('LOWER(product.name) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.sort === 'price_asc') qb.orderBy('product.price', 'ASC');
    else if (query.sort === 'price_desc') qb.orderBy('product.price', 'DESC');
    else qb.orderBy('product.createdAt', 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Admin listing — includes inactive products
  async findAllAdmin() {
    return this.productsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepo.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.name || dto.slug) {
      const newSlug = slugify(dto.slug || dto.name || product.name);
      const existing = await this.productsRepo.findOne({ where: { slug: newSlug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Product with this name/slug already exists');
      }
      product.slug = newSlug;
    }
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepo.remove(product);
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    await this.productsRepo.decrement({ id }, 'stock', quantity);
  }
}

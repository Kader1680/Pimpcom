import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const existing = await this.categoriesRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Category with this name/slug already exists');

    const category = this.categoriesRepo.create({ ...dto, slug });
    return this.categoriesRepo.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepo.findOne({ where: { slug } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.name || dto.slug) {
      const newSlug = slugify(dto.slug || dto.name || category.name);
      const existing = await this.categoriesRepo.findOne({ where: { slug: newSlug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Category with this name/slug already exists');
      }
      category.slug = newSlug;
    }
    Object.assign(category, dto);
    return this.categoriesRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepo.remove(category);
  }
}

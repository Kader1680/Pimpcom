"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
let ProductsService = class ProductsService {
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async create(dto) {
        const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
        const existing = await this.productsRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Product with this name/slug already exists');
        const product = this.productsRepo.create({ ...dto, slug });
        return this.productsRepo.save(product);
    }
    async findAll(query) {
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
        if (query.sort === 'price_asc')
            qb.orderBy('product.price', 'ASC');
        else if (query.sort === 'price_desc')
            qb.orderBy('product.price', 'DESC');
        else
            qb.orderBy('product.createdAt', 'DESC');
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
    async findAllAdmin() {
        return this.productsRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findBySlug(slug) {
        const product = await this.productsRepo.findOne({ where: { slug } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (dto.name || dto.slug) {
            const newSlug = slugify(dto.slug || dto.name || product.name);
            const existing = await this.productsRepo.findOne({ where: { slug: newSlug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Product with this name/slug already exists');
            }
            product.slug = newSlug;
        }
        Object.assign(product, dto);
        return this.productsRepo.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepo.remove(product);
    }
    async decrementStock(id, quantity) {
        await this.productsRepo.decrement({ id }, 'stock', quantity);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map
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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
let CategoriesService = class CategoriesService {
    constructor(categoriesRepo) {
        this.categoriesRepo = categoriesRepo;
    }
    async create(dto) {
        const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
        const existing = await this.categoriesRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Category with this name/slug already exists');
        const category = this.categoriesRepo.create({ ...dto, slug });
        return this.categoriesRepo.save(category);
    }
    findAll() {
        return this.categoriesRepo.find({ order: { name: 'ASC' } });
    }
    async findOne(id) {
        const category = await this.categoriesRepo.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async findBySlug(slug) {
        const category = await this.categoriesRepo.findOne({ where: { slug } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        if (dto.name || dto.slug) {
            const newSlug = slugify(dto.slug || dto.name || category.name);
            const existing = await this.categoriesRepo.findOne({ where: { slug: newSlug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Category with this name/slug already exists');
            }
            category.slug = newSlug;
        }
        Object.assign(category, dto);
        return this.categoriesRepo.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoriesRepo.remove(category);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map
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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CartService = class CartService {
    constructor(cartRepo, cartItemRepo, productRepo) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartRepo.findOne({ where: { userId } });
        if (!cart) {
            cart = this.cartRepo.create({ userId, items: [] });
            cart = await this.cartRepo.save(cart);
        }
        return cart;
    }
    async addItem(userId, dto) {
        const product = await this.productRepo.findOne({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.stock < dto.quantity) {
            throw new common_1.BadRequestException('Not enough stock available');
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = cart.items?.find((i) => i.productId === dto.productId);
        if (existingItem) {
            existingItem.quantity += dto.quantity;
            await this.cartItemRepo.save(existingItem);
        }
        else {
            const item = this.cartItemRepo.create({
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            });
            await this.cartItemRepo.save(item);
        }
        return this.getOrCreateCart(userId);
    }
    async updateItem(userId, itemId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const item = cart.items?.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        if (item.product.stock < dto.quantity) {
            throw new common_1.BadRequestException('Not enough stock available');
        }
        item.quantity = dto.quantity;
        await this.cartItemRepo.save(item);
        return this.getOrCreateCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = cart.items?.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        await this.cartItemRepo.remove(item);
        return this.getOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        if (cart.items?.length) {
            await this.cartItemRepo.remove(cart.items);
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map
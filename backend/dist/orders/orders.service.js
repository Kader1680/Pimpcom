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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const cart_service_1 = require("../cart/cart.service");
const product_entity_1 = require("../products/entities/product.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepo, orderItemsRepo, cartService, dataSource) {
        this.ordersRepo = ordersRepo;
        this.orderItemsRepo = orderItemsRepo;
        this.cartService = cartService;
        this.dataSource = dataSource;
    }
    async createFromCart(userId, dto) {
        const cart = await this.cartService.getOrCreateCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        return this.dataSource.transaction(async (manager) => {
            let total = 0;
            const orderItems = [];
            for (const item of cart.items) {
                const product = await manager.findOne(product_entity_1.Product, {
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.BadRequestException(`Product ${item.productId} no longer exists`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Not enough stock for "${product.name}"`);
                }
                const unitPrice = Number(product.price);
                total += unitPrice * item.quantity;
                const orderItem = manager.create(order_item_entity_1.OrderItem, {
                    productId: product.id,
                    productName: product.name,
                    unitPrice,
                    quantity: item.quantity,
                });
                orderItems.push(orderItem);
                product.stock -= item.quantity;
                await manager.save(product);
            }
            const order = manager.create(order_entity_1.Order, {
                userId,
                items: orderItems,
                total,
                shippingAddress: dto.shippingAddress,
            });
            const saved = await manager.save(order);
            await this.cartService.clearCart(userId);
            return saved;
        });
    }
    findAllForUser(userId) {
        return this.ordersRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    findAllAdmin() {
        return this.ordersRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findOneForUser(id, userId) {
        const order = await this.ordersRepo.findOne({ where: { id, userId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.findOne(id);
        order.status = dto.status;
        return this.ordersRepo.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
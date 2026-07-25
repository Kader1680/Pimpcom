"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const user_entity_1 = require("./users/entities/user.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const product_entity_1 = require("./products/entities/product.entity");
const cart_entity_1 = require("./cart/entities/cart.entity");
const cart_item_entity_1 = require("./cart/entities/cart-item.entity");
const order_entity_1 = require("./orders/entities/order.entity");
const order_item_entity_1 = require("./orders/entities/order-item.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'postgres'),
                    port: parseInt(config.get('DB_PORT', '5432'), 10),
                    username: config.get('DB_USERNAME', 'pimpcom'),
                    password: config.get('DB_PASSWORD', 'pimpcom'),
                    database: config.get('DB_NAME', 'pimpcomdb'),
                    entities: [user_entity_1.User, category_entity_1.Category, product_entity_1.Product, cart_entity_1.Cart, cart_item_entity_1.CartItem, order_entity_1.Order, order_item_entity_1.OrderItem],
                    synchronize: true,
                    autoLoadEntities: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const user_entity_1 = require("./users/entities/user.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const product_entity_1 = require("./products/entities/product.entity");
const role_enum_1 = require("./common/role.enum");
dotenv.config();
async function seed() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'ecommerce',
        entities: [user_entity_1.User, category_entity_1.Category, product_entity_1.Product],
        synchronize: true,
    });
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const categoryRepo = dataSource.getRepository(category_entity_1.Category);
    const productRepo = dataSource.getRepository(product_entity_1.Product);
    const adminEmail = 'admin@shop.com';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!admin) {
        admin = userRepo.create({
            name: 'Admin',
            email: adminEmail,
            password: await bcrypt.hash('Admin123!', 10),
            role: role_enum_1.Role.ADMIN,
        });
        await userRepo.save(admin);
        console.log(`Created admin user: ${adminEmail} / Admin123!`);
    }
    const customerEmail = 'customer@shop.com';
    let customer = await userRepo.findOne({ where: { email: customerEmail } });
    if (!customer) {
        customer = userRepo.create({
            name: 'Jane Customer',
            email: customerEmail,
            password: await bcrypt.hash('Customer123!', 10),
            role: role_enum_1.Role.CUSTOMER,
        });
        await userRepo.save(customer);
        console.log(`Created customer user: ${customerEmail} / Customer123!`);
    }
    const categoryData = [
        { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
        { name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories' },
        { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'For your household' },
        { name: 'Books', slug: 'books', description: 'Fiction and non-fiction' },
    ];
    const categories = [];
    for (const c of categoryData) {
        let cat = await categoryRepo.findOne({ where: { slug: c.slug } });
        if (!cat) {
            cat = categoryRepo.create(c);
            cat = await categoryRepo.save(cat);
        }
        categories.push(cat);
    }
    const productData = [
        {
            name: 'Wireless Headphones',
            slug: 'wireless-headphones',
            description: 'Noise-cancelling over-ear wireless headphones with 30hr battery life.',
            price: 129.99,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            categorySlug: 'electronics',
        },
        {
            name: 'Smart Watch',
            slug: 'smart-watch',
            description: 'Fitness tracking smart watch with heart-rate monitor.',
            price: 199.99,
            stock: 35,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
            categorySlug: 'electronics',
        },
        {
            name: 'Classic Denim Jacket',
            slug: 'classic-denim-jacket',
            description: 'A timeless denim jacket for all seasons.',
            price: 79.99,
            stock: 60,
            imageUrl: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800',
            categorySlug: 'clothing',
        },
        {
            name: 'Running Sneakers',
            slug: 'running-sneakers',
            description: 'Lightweight running shoes with breathable mesh.',
            price: 89.99,
            stock: 80,
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
            categorySlug: 'clothing',
        },
        {
            name: 'Stainless Steel Cookware Set',
            slug: 'cookware-set',
            description: '10-piece stainless steel cookware set.',
            price: 249.99,
            stock: 20,
            imageUrl: 'https://images.unsplash.com/photo-1584990347449-a0d6a4e6b8b8?w=800',
            categorySlug: 'home-kitchen',
        },
        {
            name: 'Ceramic Coffee Mug Set',
            slug: 'coffee-mug-set',
            description: 'Set of 4 handcrafted ceramic mugs.',
            price: 34.99,
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800',
            categorySlug: 'home-kitchen',
        },
        {
            name: 'The Art of Clean Code',
            slug: 'art-of-clean-code',
            description: 'A practical guide to writing maintainable software.',
            price: 24.99,
            stock: 45,
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734e5c86?w=800',
            categorySlug: 'books',
        },
        {
            name: 'Science Fiction Anthology',
            slug: 'scifi-anthology',
            description: 'A curated collection of short science fiction stories.',
            price: 19.99,
            stock: 55,
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
            categorySlug: 'books',
        },
    ];
    for (const p of productData) {
        const existing = await productRepo.findOne({ where: { slug: p.slug } });
        if (!existing) {
            const category = categories.find((c) => c.slug === p.categorySlug);
            const { categorySlug, ...rest } = p;
            const product = productRepo.create({
                ...rest,
                categoryId: category?.id,
            });
            await productRepo.save(product);
        }
    }
    console.log('Seed complete ✅');
    await dataSource.destroy();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
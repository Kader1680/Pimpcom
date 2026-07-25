import { Category } from '../../categories/entities/category.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
export declare class Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    category: Category;
    categoryId: string;
    cartItems: CartItem[];
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

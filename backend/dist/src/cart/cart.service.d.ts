import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartService {
    private readonly cartRepo;
    private readonly cartItemRepo;
    private readonly productRepo;
    constructor(cartRepo: Repository<Cart>, cartItemRepo: Repository<CartItem>, productRepo: Repository<Product>);
    getOrCreateCart(userId: string): Promise<Cart>;
    addItem(userId: string, dto: AddCartItemDto): Promise<Cart>;
    updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<Cart>;
    removeItem(userId: string, itemId: string): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
}

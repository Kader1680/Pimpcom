import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<import("./entities/cart.entity").Cart>;
    addItem(userId: string, dto: AddCartItemDto): Promise<import("./entities/cart.entity").Cart>;
    updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<import("./entities/cart.entity").Cart>;
    removeItem(userId: string, itemId: string): Promise<import("./entities/cart.entity").Cart>;
    clearCart(userId: string): Promise<void>;
}

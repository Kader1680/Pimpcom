import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<Cart> {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItem = cart.items?.find((i) => i.productId === dto.productId);

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const item = this.cartItemRepo.create({
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      });
      await this.cartItemRepo.save(item);
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    if (item.product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    await this.cartItemRepo.remove(item);
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    if (cart.items?.length) {
      await this.cartItemRepo.remove(cart.items);
    }
  }
}

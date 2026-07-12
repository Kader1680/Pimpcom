import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource,
  ) {}

  async createFromCart(userId: string, dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const item of cart.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product) {
          throw new BadRequestException(`Product ${item.productId} no longer exists`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for "${product.name}"`);
        }

        const unitPrice = Number(product.price);
        total += unitPrice * item.quantity;

        const orderItem = manager.create(OrderItem, {
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: item.quantity,
        });
        orderItems.push(orderItem);

        product.stock -= item.quantity;
        await manager.save(product);
      }

      const order = manager.create(Order, {
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

  findAllForUser(userId: string): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findAllAdmin(): Promise<Order[]> {
    return this.ordersRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOneForUser(id: string, userId: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.ordersRepo.save(order);
  }
}

import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
export declare class OrdersService {
    private readonly ordersRepo;
    private readonly orderItemsRepo;
    private readonly cartService;
    private readonly dataSource;
    constructor(ordersRepo: Repository<Order>, orderItemsRepo: Repository<OrderItem>, cartService: CartService, dataSource: DataSource);
    createFromCart(userId: string, dto: CreateOrderDto): Promise<Order>;
    findAllForUser(userId: string): Promise<Order[]>;
    findAllAdmin(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    findOneForUser(id: string, userId: string): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>;
}

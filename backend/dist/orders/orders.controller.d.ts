import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findMine(userId: string): Promise<import("./entities/order.entity").Order[]>;
    findMineOne(userId: string, id: string): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("./entities/order.entity").Order>;
}

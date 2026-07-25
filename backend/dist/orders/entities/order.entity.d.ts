import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../../common/order-status.enum';
export declare class Order {
    id: string;
    user: User;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

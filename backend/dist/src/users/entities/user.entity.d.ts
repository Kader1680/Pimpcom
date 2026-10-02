import { Role } from '../../common/role.enum';
import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}

import { OrderStatus } from '../../common/order-status.enum';
export declare class CreateOrderDto {
    shippingAddress?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}

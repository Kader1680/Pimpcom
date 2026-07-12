import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../common/order-status.enum';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

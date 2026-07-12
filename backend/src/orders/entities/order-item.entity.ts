import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: string;

  // snapshot fields so the order stays accurate even if the product changes later
  @Column()
  productName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column()
  quantity: number;
}

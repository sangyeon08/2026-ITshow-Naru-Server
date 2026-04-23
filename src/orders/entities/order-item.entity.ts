import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from '../../menus/entities/menu.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() quantity: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) unitPrice: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) subtotal: number;
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' }) order: Order;
  @ManyToOne(() => Menu, menu => menu.orderItems, { eager: true }) menu: Menu;
}

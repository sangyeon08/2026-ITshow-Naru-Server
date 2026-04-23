import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus { PENDING='PENDING', COOKING='COOKING', DELIVERING='DELIVERING', COMPLETED='COMPLETED', CANCELLED='CANCELLED' }

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }) status: OrderStatus;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) totalPrice: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) deliveryFee: number;
  @Column({ nullable: true }) deliveryAddress: string;
  @Column({ nullable: true }) paymentMethod: string;
  @Column({ nullable: true }) specialRequest: string;
  @Column({ nullable: true }) statusChangedAt: Date;
  @ManyToOne(() => User, user => user.orders) user: User;
  @ManyToOne(() => Store, store => store.orders) store: Store;
  @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true }) items: OrderItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

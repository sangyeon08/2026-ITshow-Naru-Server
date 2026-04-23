import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column('text', { array: true, default: [] }) allergens: string[];
  @Column({ default: true }) isAvailable: boolean;
  @Column({ default: false }) isBestSeller: boolean;
  @ManyToOne(() => Store, store => store.menus, { onDelete: 'CASCADE' }) store: Store;
  @OneToMany(() => OrderItem, item => item.menu) orderItems: OrderItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

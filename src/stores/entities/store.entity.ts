import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Menu } from '../../menus/entities/menu.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() address: string;
  @Column({ type: 'decimal', precision: 10, scale: 7 }) latitude: number;
  @Column({ type: 'decimal', precision: 10, scale: 7 }) longitude: number;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ nullable: true }) openTime: string;
  @Column({ nullable: true }) closeTime: string;
  @Column({ nullable: true }) closedDays: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) rating: number;
  @Column({ default: 0 }) reviewCount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) deliveryFee: number;
  @Column({ default: 0 }) minOrderAmount: number;
  @Column({ default: true }) isOpen: boolean;
  @Column({ default: false }) isFeatured: boolean;
  @ManyToOne(() => Category, category => category.stores, { eager: true }) category: Category;
  @OneToMany(() => Menu, menu => menu.store) menus: Menu[];
  @OneToMany(() => Order, order => order.store) orders: Order[];
  @OneToMany(() => Review, review => review.store) reviews: Review[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

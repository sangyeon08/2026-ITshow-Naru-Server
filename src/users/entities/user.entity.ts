import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { ExchangeHistory } from '../../exchange/entities/exchange-history.entity';

export enum Nationality { KOREAN='KO', JAPANESE='JA', CHINESE='ZH', ENGLISH='EN', FRENCH='FR', GERMAN='DE', SPANISH='ES', OTHER='OTHER' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ type: 'enum', enum: Nationality, default: Nationality.OTHER }) nationality: Nationality;
  @Column('text', { array: true, default: [] }) allergies: string[];
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) krwBalance: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) foreignBalance: number;
  @Column({ nullable: true }) profileImage: string;
  @Column({ nullable: true }) defaultPaymentMethod: string;
  @Column({ default: true }) isActive: boolean;
  @OneToMany(() => Order, order => order.user) orders: Order[];
  @OneToMany(() => Review, review => review.user) reviews: Review[];
  @OneToMany(() => Coupon, coupon => coupon.user) coupons: Coupon[];
  @OneToMany(() => ExchangeHistory, history => history.user) exchangeHistories: ExchangeHistory[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

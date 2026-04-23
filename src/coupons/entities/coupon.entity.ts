import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() code: string;
  @Column({ type: 'decimal', precision: 5, scale: 2 }) discountRate: number;
  @Column() expiresAt: Date;
  @Column({ default: false }) isUsed: boolean;
  @Column({ nullable: true }) usedAt: Date;
  @ManyToOne(() => User, user => user.coupons) user: User;
  @CreateDateColumn() createdAt: Date;
}

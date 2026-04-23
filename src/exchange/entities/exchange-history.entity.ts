import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ExchangeDirection { TO_KRW='TO_KRW', FROM_KRW='FROM_KRW' }

@Entity('exchange_histories')
export class ExchangeHistory {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'enum', enum: ExchangeDirection }) direction: ExchangeDirection;
  @Column() fromCurrency: string;
  @Column() toCurrency: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) fromAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) toAmount: number;
  @Column({ type: 'decimal', precision: 15, scale: 6 }) rate: number;
  @ManyToOne(() => User, user => user.exchangeHistories) user: User;
  @CreateDateColumn() createdAt: Date;
}

import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'int' }) rating: number;
  @Column({ nullable: true }) comment: string;
  @Column({ nullable: true }) nationality: string;
  @ManyToOne(() => User, user => user.reviews) user: User;
  @ManyToOne(() => Store, store => store.reviews, { onDelete: 'CASCADE' }) store: Store;
  @CreateDateColumn() createdAt: Date;
}

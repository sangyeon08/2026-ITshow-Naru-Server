import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

export enum CategoryType { KOREAN='KOREAN', CHINESE='CHINESE', JAPANESE='JAPANESE', WESTERN='WESTERN', SNACKS='SNACKS' }

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'enum', enum: CategoryType, unique: true }) type: CategoryType;
  @Column() nameKo: string;
  @Column() nameEn: string;
  @Column({ nullable: true }) icon: string;
  @Column({ nullable: true }) imageUrl: string;
  @OneToMany(() => Store, store => store.category) stores: Store[];
}

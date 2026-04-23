import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>) {}

  async findByUser(userId: string): Promise<Coupon[]> {
    return this.couponRepository.find({ where: { user: { id: userId } }, order: { expiresAt: 'ASC' } });
  }

  async findActiveByUser(userId: string): Promise<Coupon[]> {
    return this.couponRepository.createQueryBuilder('coupon')
      .where('coupon.userId = :userId', { userId })
      .andWhere('coupon.isUsed = false')
      .andWhere('coupon.expiresAt > :now', { now: new Date() })
      .getMany();
  }
}

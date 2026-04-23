import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly reviewRepository: Repository<Review>) {}

  async findByStore(storeId: string, nationality?: string): Promise<Review[]> {
    const qb = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.storeId = :storeId', { storeId });
    if (nationality) {
      qb.orderBy(`CASE WHEN review.nationality = '${nationality}' THEN 0 ELSE 1 END`);
    }
    return qb.getMany();
  }
}

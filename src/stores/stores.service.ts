import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(@InjectRepository(Store) private readonly storeRepository: Repository<Store>) {}

  async findAll(categoryId?: number, search?: string): Promise<Store[]> {
    const where: any = {};
    if (categoryId) where.category = { id: categoryId };
    if (search) where.name = ILike(`%${search}%`);
    return this.storeRepository.find({ where, relations: ['category', 'menus'] });
  }

  async findNearby(lat: number, lng: number, radius = 5): Promise<Store[]> {
    const stores = await this.storeRepository.query(
      `SELECT *, ( 6371 * acos( cos( radians($1) ) * cos( radians(latitude) ) * cos( radians(longitude) - radians($2) ) + sin( radians($1) ) * sin( radians(latitude) ) ) ) AS distance FROM stores HAVING distance < $3 ORDER BY distance LIMIT 20`,
      [lat, lng, radius],
    );
    return stores;
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id }, relations: ['category', 'menus', 'reviews', 'reviews.user'] });
    if (!store) throw new NotFoundException(`Store #${id} not found`);
    return store;
  }

  async findFeatured(): Promise<Store[]> {
    return this.storeRepository.find({ where: { isFeatured: true }, relations: ['category'], take: 10 });
  }

  async search(keyword: string): Promise<Store[]> {
    return this.storeRepository.find({
      where: [{ name: ILike(`%${keyword}%`) }],
      relations: ['category'],
      take: 20,
    });
  }
}

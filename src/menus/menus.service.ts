import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) {}

  async findByStore(storeId: string): Promise<Menu[]> {
    return this.menuRepository.find({ where: { store: { id: storeId } }, relations: ['store'] });
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id }, relations: ['store'] });
    if (!menu) throw new NotFoundException(`Menu #${id} not found`);
    return menu;
  }

  async checkAllergies(menuId: string, userAllergies: string[]): Promise<{ hasAllergen: boolean; matchedAllergens: string[] }> {
    const menu = await this.findOne(menuId);
    const matchedAllergens = menu.allergens.filter(a => userAllergies.map(u => u.toLowerCase()).includes(a.toLowerCase()));
    return { hasAllergen: matchedAllergens.length > 0, matchedAllergens };
  }
}

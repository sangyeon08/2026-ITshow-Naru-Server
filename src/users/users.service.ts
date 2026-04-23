import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) throw new BadRequestException('Email already in use');
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ ...createUserDto, password: hashed });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ select: ['id', 'email', 'name', 'phone', 'nationality', 'allergies', 'krwBalance', 'foreignBalance', 'profileImage', 'defaultPaymentMethod', 'isActive', 'createdAt'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'coupons'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return {
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      nationality: user.nationality, allergies: user.allergies,
      krwBalance: user.krwBalance, foreignBalance: user.foreignBalance,
      profileImage: user.profileImage, defaultPaymentMethod: user.defaultPaymentMethod,
      orderCount: user.orders?.length ?? 0,
      activeCoupons: user.coupons?.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date()).length ?? 0,
    };
  }
}

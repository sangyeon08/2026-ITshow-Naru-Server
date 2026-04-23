import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Menu } from '../menus/entities/menu.entity';
import { Store } from '../stores/entities/store.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
  ) {}

  async create(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const store = await this.storeRepository.findOne({ where: { id: createOrderDto.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const menu = await this.menuRepository.findOne({ where: { id: itemDto.menuId } });
      if (!menu) throw new NotFoundException(`Menu #${itemDto.menuId} not found`);
      if (!menu.isAvailable) throw new BadRequestException(`Menu ${menu.name} is not available`);
      const subtotal = Number(menu.price) * itemDto.quantity;
      totalPrice += subtotal;
      const item = this.orderItemRepository.create({ menu, quantity: itemDto.quantity, unitPrice: menu.price, subtotal });
      orderItems.push(item);
    }

    const order = this.orderRepository.create({
      user,
      store,
      items: orderItems,
      totalPrice,
      deliveryFee: store.deliveryFee,
      deliveryAddress: createOrderDto.deliveryAddress,
      paymentMethod: createOrderDto.paymentMethod,
      specialRequest: createOrderDto.specialRequest,
      status: OrderStatus.PENDING,
    });

    const saved = await this.orderRepository.save(order);
    this.scheduleStatusProgression(saved.id);
    return saved;
  }

  private scheduleStatusProgression(orderId: string) {
    setTimeout(async () => {
      await this.updateStatus(orderId, OrderStatus.COOKING);
      setTimeout(async () => {
        await this.updateStatus(orderId, OrderStatus.DELIVERING);
        setTimeout(async () => {
          await this.updateStatus(orderId, OrderStatus.COMPLETED);
        }, 15000);
      }, 15000);
    }, 15000);
  }

  private async updateStatus(orderId: string, status: OrderStatus) {
    await this.orderRepository.update(orderId, { status, statusChangedAt: new Date() });
  }

  async findAll(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['store', 'items', 'items.menu'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['store', 'items', 'items.menu'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async getStatus(id: string, userId: string) {
    const order = await this.findOne(id, userId);
    return {
      orderId: order.id,
      status: order.status,
      statusChangedAt: order.statusChangedAt,
      createdAt: order.createdAt,
      nextStatusIn: this.getNextStatusDelay(order),
    };
  }

  private getNextStatusDelay(order: Order): number | null {
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    const step = 15000;
    if (order.status === OrderStatus.PENDING) return Math.max(0, step - elapsed);
    if (order.status === OrderStatus.COOKING) return Math.max(0, step * 2 - elapsed);
    if (order.status === OrderStatus.DELIVERING) return Math.max(0, step * 3 - elapsed);
    return null;
  }
}

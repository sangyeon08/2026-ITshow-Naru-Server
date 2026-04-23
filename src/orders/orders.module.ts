import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Menu } from '../menus/entities/menu.entity';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Menu, Store])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

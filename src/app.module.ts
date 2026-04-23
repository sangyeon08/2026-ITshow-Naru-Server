import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { ExchangeModule } from './exchange/exchange.module';
import { NavigationModule } from './navigation/navigation.module';
import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Menu } from './menus/entities/menu.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Category } from './categories/entities/category.entity';
import { Review } from './reviews/entities/review.entity';
import { Coupon } from './coupons/entities/coupon.entity';
import { ExchangeHistory } from './exchange/entities/exchange-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [User, Store, Menu, Order, OrderItem, Category, Review, Coupon, ExchangeHistory],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    MenusModule,
    OrdersModule,
    CategoriesModule,
    ReviewsModule,
    CouponsModule,
    ExchangeModule,
    NavigationModule,
  ],
})
export class AppModule {}

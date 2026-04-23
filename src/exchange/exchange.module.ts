import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeHistory } from './entities/exchange-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ExchangeHistory, User])],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}

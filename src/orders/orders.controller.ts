import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (place order and start 15s status progression)' })
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user.id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get order status (for 15s polling)' })
  getStatus(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.getStatus(id, user.id);
  }
}

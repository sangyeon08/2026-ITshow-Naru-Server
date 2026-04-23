import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ExchangeService } from './exchange.service';
import { ExchangeDto } from './dto/exchange.dto';

@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get current exchange rates (KRW per 1 foreign currency unit)' })
  @ApiQuery({ name: 'base', required: false, example: 'KRW' })
  getRates(@Query('base') base?: string) {
    return this.exchangeService.getRates(base);
  }

  @Get('rate')
  @ApiOperation({ summary: 'Get exchange rate for a specific currency' })
  @ApiQuery({ name: 'currency', required: true, example: 'USD' })
  getRate(@Query('currency') currency: string) {
    return this.exchangeService.getRate(currency);
  }

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perform currency exchange (TO_KRW or FROM_KRW)' })
  exchange(@CurrentUser() user: User, @Body() dto: ExchangeDto) {
    return this.exchangeService.exchange(user, dto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exchange history for current user' })
  getHistory(@CurrentUser() user: User) {
    return this.exchangeService.getHistory(user.id);
  }
}

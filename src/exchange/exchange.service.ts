import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ExchangeHistory, ExchangeDirection } from './entities/exchange-history.entity';
import { User } from '../users/entities/user.entity';
import { ExchangeDto, ExchangeType } from './dto/exchange.dto';

const FALLBACK_RATES: Record<string, number> = {
  USD: 1350, EUR: 1470, JPY: 9.1, CNY: 186, GBP: 1710, AUD: 870, CAD: 990, SGD: 1000,
};

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  private cachedRates: Record<string, number> = {};
  private lastFetched: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(ExchangeHistory) private readonly exchangeHistoryRepository: Repository<ExchangeHistory>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getRates(baseCurrency = 'KRW'): Promise<{ base: string; rates: Record<string, number>; timestamp: string; source: string }> {
    try {
      const apiUrl = this.configService.get<string>('exchangeApi.url');
      const response = await firstValueFrom(this.httpService.get(`${apiUrl}/KRW`));
      this.cachedRates = response.data.rates || {};
      this.lastFetched = new Date();
      const invertedRates: Record<string, number> = {};
      for (const [currency, rate] of Object.entries(this.cachedRates)) {
        if (typeof rate === 'number' && rate > 0) invertedRates[currency] = 1 / rate;
      }
      return { base: baseCurrency, rates: invertedRates, timestamp: this.lastFetched.toISOString(), source: 'live' };
    } catch (err) {
      this.logger.warn('Exchange rate API failed, using fallback rates');
      return { base: 'KRW', rates: FALLBACK_RATES, timestamp: new Date().toISOString(), source: 'fallback' };
    }
  }

  async getRate(currency: string): Promise<number> {
    const { rates } = await this.getRates();
    const rate = rates[currency.toUpperCase()];
    if (!rate) throw new BadRequestException(`Unsupported currency: ${currency}`);
    return rate;
  }

  async exchange(user: User, dto: ExchangeDto): Promise<{ user: Partial<User>; history: ExchangeHistory }> {
    const rate = await this.getRate(dto.currency);
    let fromAmount: number;
    let toAmount: number;
    let fromCurrency: string;
    let toCurrency: string;
    let direction: ExchangeDirection;

    if (dto.direction === ExchangeType.TO_KRW) {
      if (user.foreignBalance < dto.amount) throw new BadRequestException('Insufficient foreign balance');
      fromAmount = dto.amount;
      toAmount = Math.round(dto.amount * rate);
      fromCurrency = dto.currency;
      toCurrency = 'KRW';
      direction = ExchangeDirection.TO_KRW;
      user.foreignBalance = Number(user.foreignBalance) - fromAmount;
      user.krwBalance = Number(user.krwBalance) + toAmount;
    } else {
      fromAmount = dto.amount;
      toAmount = Math.round((dto.amount / rate) * 100) / 100;
      if (user.krwBalance < fromAmount) throw new BadRequestException('Insufficient KRW balance');
      fromCurrency = 'KRW';
      toCurrency = dto.currency;
      direction = ExchangeDirection.FROM_KRW;
      user.krwBalance = Number(user.krwBalance) - fromAmount;
      user.foreignBalance = Number(user.foreignBalance) + toAmount;
    }

    await this.userRepository.save(user);
    const history = this.exchangeHistoryRepository.create({ user, direction, fromCurrency, toCurrency, fromAmount, toAmount, rate });
    await this.exchangeHistoryRepository.save(history);
    return {
      user: { id: user.id, krwBalance: user.krwBalance, foreignBalance: user.foreignBalance },
      history,
    };
  }

  async getHistory(userId: string): Promise<ExchangeHistory[]> {
    return this.exchangeHistoryRepository.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}

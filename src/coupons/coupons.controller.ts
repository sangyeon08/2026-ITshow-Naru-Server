import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CouponsService } from './coupons.service';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coupons for current user' })
  findMyCoupons(@CurrentUser() user: User) {
    return this.couponsService.findByUser(user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active (unused, not expired) coupons' })
  findActiveCoupons(@CurrentUser() user: User) {
    return this.couponsService.findActiveByUser(user.id);
  }
}

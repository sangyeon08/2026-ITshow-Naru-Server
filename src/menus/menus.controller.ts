import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MenusService } from './menus.service';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({ summary: 'Get menus by store' })
  @ApiQuery({ name: 'storeId', required: true })
  findByStore(@Query('storeId') storeId: string) {
    return this.menusService.findByStore(storeId);
  }

  @Get(':id/allergy-check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if menu contains user allergens' })
  checkAllergies(@Param('id') id: string, @CurrentUser() user: User) {
    return this.menusService.checkAllergies(id, user.allergies ?? []);
  }
}

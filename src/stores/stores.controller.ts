import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stores (with optional category filter and search)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('categoryId') categoryId?: number, @Query('search') search?: string) {
    return this.storesService.findAll(categoryId, search);
  }

  @Get('nearby')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get nearby stores based on coordinates' })
  @ApiQuery({ name: 'lat', required: true })
  @ApiQuery({ name: 'lng', required: true })
  @ApiQuery({ name: 'radius', required: false })
  findNearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius?: number) {
    return this.storesService.findNearby(lat, lng, radius);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured/banner stores' })
  findFeatured() {
    return this.storesService.findFeatured();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store details with menus and reviews' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }
}

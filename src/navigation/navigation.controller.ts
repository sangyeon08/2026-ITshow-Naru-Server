import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';

@ApiTags('Navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search places by keyword (supports dummy data)' })
  @ApiQuery({ name: 'q', required: false })
  searchPlaces(@Query('q') keyword?: string) {
    return this.navigationService.searchPlaces(keyword ?? '');
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby restaurant recommendations' })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  getNearby(@Query('lat') lat?: number, @Query('lng') lng?: number) {
    return this.navigationService.getNearbyRecommendations(lat, lng);
  }

  @Get('routes/:destinationId')
  @ApiOperation({ summary: 'Get transit routes to destination (dummy data)' })
  @ApiQuery({ name: 'fromLat', required: false })
  @ApiQuery({ name: 'fromLng', required: false })
  getRoutes(
    @Param('destinationId') destinationId: string,
    @Query('fromLat') fromLat?: number,
    @Query('fromLng') fromLng?: number,
  ) {
    return this.navigationService.getRoutes(destinationId, fromLat, fromLng);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get reviews for a store (sorted by same nationality first)' })
  @ApiQuery({ name: 'nationality', required: false })
  findByStore(@Param('storeId') storeId: string, @Query('nationality') nationality?: string) {
    return this.reviewsService.findByStore(storeId, nationality);
  }
}

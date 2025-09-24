import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
  Logger
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewFiltersDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create review (client only, after job completion)
   * POST /reviews
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  async create(
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Client ${user.id} creating review for booking ${createReviewDto.booking_id}`);
    return this.reviewsService.create(createReviewDto, user.id);
  }

  /**
   * Get reviews with filters
   * GET /reviews
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getReviews(
    @Query() filters: ReviewFiltersDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Getting reviews with filters for user: ${user.id}`);
    return this.reviewsService.findAll(filters, user.id);
  }

  /**
   * Get single review
   * GET /reviews/:id
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Getting review ${id} for user ${user.id}`);
    return this.reviewsService.findOne(id, user.id);
  }

  /**
   * Update review (reviewer only)
   * PATCH /reviews/:id
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} updating review ${id}`);
    return this.reviewsService.update(id, updateReviewDto, user.id);
  }

  /**
   * Delete review (reviewer only)
   * DELETE /reviews/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`User ${user.id} deleting review ${id}`);
    return this.reviewsService.remove(id, user.id);
  }

  /**
   * Check if user can review a booking
   * GET /reviews/can-review/:bookingId
   */
  @UseGuards(JwtAuthGuard)
  @Get('can-review/:bookingId')
  async canReview(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Checking if user ${user.id} can review booking ${bookingId}`);
    return this.reviewsService.canReview(bookingId, user.id);
  }

  /**
   * Get worker reviews (public endpoint)
   * GET /reviews/worker/:workerId
   */
  @Get('worker/:workerId')
  async getWorkerReviews(
    @Param('workerId') workerId: string,
    @Query() filters: ReviewFiltersDto
  ) {
    this.logger.log(`Getting public reviews for worker: ${workerId}`);
    return this.reviewsService.getWorkerReviews(workerId, filters);
  }
}
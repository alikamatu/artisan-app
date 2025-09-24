import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query,
  UseGuards,
  ValidationPipe,
  Logger,
  ForbiddenException
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingFiltersDto } from './dto/bookings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create booking from accepted application (client only)
   * POST /bookings
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  async create(
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Client ${user.id} creating booking from application ${createBookingDto.application_id}`);
    return this.bookingsService.create(createBookingDto, user.id);
  }

  /**
   * Get user's bookings (both client and worker)
   * GET /bookings/my-bookings
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getMyBookings(
    @Query() filters: BookingFiltersDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Getting bookings for user: ${user.id}`);
    return this.bookingsService.getUserBookings(user.id, user.role, filters);
  }

  /**
   * Get single booking
   * GET /bookings/:id
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Getting booking ${id} for user ${user.id}`);
    return this.bookingsService.findOne(id, user.id);
  }

  /**
   * Update booking
   * PATCH /bookings/:id
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} updating booking ${id}`);
    return this.bookingsService.update(id, updateBookingDto, user.id);
  }

  /**
   * Mark booking as completed (client only)
   * PATCH /bookings/:id/complete
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch(':id/complete')
  async markAsCompleted(
    @Param('id') id: string,
    @Body() completionData: { completion_proof?: any[] },
    @CurrentUser() user: User
  ) {
    this.logger.log(`Client ${user.id} marking booking ${id} as completed`);
    return this.bookingsService.markAsCompleted(id, user.id, completionData.completion_proof);
  }

  /**
   * Cancel booking
   * PATCH /bookings/:id/cancel
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelData: { reason?: string },
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} canceling booking ${id}`);
    return this.bookingsService.cancel(id, user.id, cancelData.reason);
  }

  /**
   * Get all bookings (admin only)
   * GET /bookings/admin/all
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'hostel_admin')
  @Get('admin/all')
  async getAllBookingsAdmin(@Query() filters: BookingFiltersDto) {
    this.logger.log('Admin accessing all bookings');
    return this.bookingsService.findAll(filters);
  }
}

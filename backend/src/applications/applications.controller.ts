// applications.controller.ts
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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationFiltersDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(private readonly applicationsService: ApplicationsService) {}

  // ============ WORKER ROUTES ============

  /**
   * Apply to a job (workers only)
   * POST /applications
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post()
  async create(
    @Body(ValidationPipe) createApplicationDto: CreateApplicationDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Worker ${user.id} applying to job ${createApplicationDto.job_id}`);
    return this.applicationsService.create(createApplicationDto, user.id);
  }

  /**
   * Get worker's own applications
   * GET /applications/my-applications
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-applications')
  async getMyApplications(
    @Query() filters: ApplicationFiltersDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Getting applications for worker: ${user.id}`);
    return this.applicationsService.getWorkerApplications(user.id, filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('client')
@Get('clients/my-jobs')
async getMyJobsApplications(
  @Query() filters: ApplicationFiltersDto,
  @CurrentUser() user: User
) {
  this.logger.log(`Getting applications for all jobs by client ${user.id}`);
  return this.applicationsService.getClientApplications(user.id, filters);
}

  /**
   * Withdraw application (worker only)
   * PATCH /applications/:id/withdraw
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Patch(':id/withdraw')
  async withdrawApplication(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Worker ${user.id} withdrawing application ${id}`);
    return this.applicationsService.withdrawApplication(id, user.id);
  }

  // ============ CLIENT ROUTES ============

  /**
   * Get applications for a specific job (job owner only)
   * GET /applications/job/:jobId
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get('job/:jobId')
  async getJobApplications(
    @Param('jobId') jobId: string,
    @Query() filters: ApplicationFiltersDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Getting applications for job ${jobId} by client ${user.id}`);
    return this.applicationsService.getJobApplications(jobId, user.id, filters);
  }

  /**
   * Accept application (job owner only)
   * PATCH /applications/:id/accept
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch(':id/accept')
  async acceptApplication(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Client ${user.id} accepting application ${id}`);
    return this.applicationsService.acceptApplication(id, user.id);
  }

  /**
   * Reject application (job owner only)
   * PATCH /applications/:id/reject
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch(':id/reject')
  async rejectApplication(
    @Param('id') id: string,
    @Body() rejectData: { reason?: string },
    @CurrentUser() user: User
  ) {
    this.logger.log(`Client ${user.id} rejecting application ${id}`);
    return this.applicationsService.rejectApplication(id, user.id, rejectData.reason);
  }

  // ============ GENERAL ROUTES ============

  /**
   * Get single application (worker who applied or job owner)
   * GET /applications/:id
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Getting application ${id} for user ${user.id}`);
    return this.applicationsService.findOne(id, user.id);
  }

  /**
   * Check if user has already applied to a job
   * GET /applications/check/:jobId
   */
  @UseGuards(JwtAuthGuard)
  @Get('check/:jobId')
  async checkApplicationExists(
    @Param('jobId') jobId: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Checking if user ${user.id} has applied to job ${jobId}`);
    return this.applicationsService.checkApplicationExists(jobId, user.id);
  }

  // ============ ADMIN ROUTES ============

  /**
   * Get all applications (admin only)
   * GET /applications/admin/all
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'hostel_admin')
  @Get('admin/all')
  async getAllApplicationsAdmin(@Query() filters: ApplicationFiltersDto) {
    this.logger.log('Admin accessing all applications');
    return this.applicationsService.findAll(filters);
  }
}
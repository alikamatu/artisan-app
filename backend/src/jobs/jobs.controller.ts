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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto, JobFiltersDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(private readonly jobsService: JobsService) {}

  // ============ DEBUG ROUTES (ADD THESE FOR TROUBLESHOOTING) ============

  /**
   * Test database connection
   * GET /jobs/debug/test-connection
   */
  @Get('debug/test-connection')
  async testConnection() {
    this.logger.log('Testing database connection...');
    return this.jobsService.testDatabaseConnection();
  }

  /**
   * Debug route to check if the issue is with the specific job ID
   * GET /jobs/debug/check/:id
   */
  @Get('debug/check/:id')
  async debugJobCheck(@Param('id') id: string) {
    this.logger.log(`Debug: Checking job ID: ${id}`);
    
    try {
      // Raw query to see what's in the database
      const result = await this.jobsService.findOne(id);
      return {
        success: true,
        message: 'Job found successfully',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.stack,
        jobId: id
      };
    }
  }

  // ============ PUBLIC ROUTES ============

  /**
   * Get all jobs (public, with optional filters)
   * MUST come before :id route
   */
  @Get()
  async findAll(@Query() filters: JobFiltersDto) {
    this.logger.log(`GET /jobs called with filters:`, filters);
    try {
      return await this.jobsService.findAll(filters);
    } catch (error) {
      this.logger.error(`Error in findAll:`, error);
      throw error;
    }
  }

  // ============ PROTECTED ROUTES (SPECIFIC ROUTES FIRST) ============

  /**
   * Create a new job (clients only)
   * MUST come before :id route to avoid conflict
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('create')
  async create(
    @Body(ValidationPipe) createJobDto: CreateJobDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Creating job for user: ${user.id}`);
    return this.jobsService.create(createJobDto, user.id);
  }

  /**
   * Get current user's jobs (clients only)
   * MUST come before :id route to avoid conflict
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get('client/my-jobs')
  async getMyJobs(
    @Query() filters: JobFiltersDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Getting jobs for client: ${user.id}`);
    return this.jobsService.getClientJobs(user.id, filters);
  }

  // ============ ADMIN ROUTES (SPECIFIC ROUTES) ============

  /**
   * Get all jobs (admin access with extended details)
   * MUST come before :id route to avoid conflict
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'hostel_admin')
  @Get('admin/all')
  async getAllJobsAdmin(@Query() filters: JobFiltersDto) {
    this.logger.log('Admin accessing all jobs');
    return this.jobsService.findAll(filters);
  }

  /**
   * Update any job status (admin only)
   * MUST come before :id route to avoid conflict
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch('admin/:id/status')
  async updateJobStatus(
    @Param('id') id: string,
    @Body() statusUpdate: { status: string; current_status?: string },
    @CurrentUser() user: User
  ) {
    this.logger.log(`Admin updating job status: ${id}`);
    
    const updateDto: UpdateJobDto = {
      status: statusUpdate.status as any,
      current_status: statusUpdate.current_status as any
    };
    
    return this.jobsService.update(id, updateDto, user.id);
  }

  // ============ PARAMETERIZED ROUTES (MUST COME LAST) ============

  /**
   * Get single job by ID
   * MUST come after all specific routes to avoid conflicts
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string, 
    @CurrentUser() user?: User
  ) {
    this.logger.log(`GET /jobs/${id} called`);
    this.logger.log(`User context:`, user ? { id: user.id, role: user.role } : 'No user');
    
    try {
      const currentUserId = user?.id;
      const result = await this.jobsService.findOne(id, currentUserId);
      this.logger.log(`Successfully fetched job: ${result.title}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching job ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a job (job owner only)
   * MUST come after all specific routes
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateJobDto: UpdateJobDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Updating job ${id} by user: ${user.id}`);
    return this.jobsService.update(id, updateJobDto, user.id);
  }

  /**
   * Delete a job (job owner only)
   * MUST come after all specific routes
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Deleting job ${id} by user: ${user.id}`);
    return this.jobsService.remove(id, user.id);
  }
}
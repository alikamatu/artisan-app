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
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { 
  CreatePortfolioDto, 
  UpdatePortfolioDto, 
  PortfolioFiltersDto 
} from './dto/portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('portfolio')
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);

  constructor(private readonly portfolioService: PortfolioService) {}

  /**
   * Create portfolio item (worker only)
   * POST /portfolio
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post()
  async create(
    @Body(ValidationPipe) createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Worker ${user.id} creating portfolio item`);
    return this.portfolioService.create(createPortfolioDto, user.id);
  }

  /**
   * Get all portfolio items with filters
   * GET /portfolio
   */
  @Get()
  async findAll(@Query() filters: PortfolioFiltersDto) {
    this.logger.log('Fetching portfolio items with filters');
    return this.portfolioService.findAll(filters);
  }

  /**
   * Get single portfolio item
   * GET /portfolio/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching portfolio item ${id}`);
    return this.portfolioService.findOne(id);
  }

  /**
   * Update portfolio item (owner only)
   * PATCH /portfolio/:id
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} updating portfolio item ${id}`);
    return this.portfolioService.update(id, updatePortfolioDto, user.id);
  }

  /**
   * Delete portfolio item (owner only)
   * DELETE /portfolio/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} deleting portfolio item ${id}`);
    return this.portfolioService.remove(id, user.id);
  }

  /**
   * Like/unlike portfolio item
   * POST /portfolio/:id/like
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    this.logger.log(`User ${user.id} liking portfolio item ${id}`);
    return this.portfolioService.likeItem(id, user.id);
  }

  /**
   * Upload media for portfolio
   * POST /portfolio/upload
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: import('multer').File
  ) {
    this.logger.log('Uploading media for portfolio');
    return this.portfolioService.uploadMedia(file);
  }

  /**
   * Get worker's portfolio items
   * GET /portfolio/worker/:workerId
   */
  @Get('worker/:workerId')
  async getWorkerPortfolio(
    @Param('workerId') workerId: string,
    @Query() filters: PortfolioFiltersDto
  ) {
    this.logger.log(`Fetching portfolio for worker ${workerId}`);
    const filtersWithWorker = { ...filters, worker_id: workerId };
    return this.portfolioService.findAll(filtersWithWorker);
  }
}
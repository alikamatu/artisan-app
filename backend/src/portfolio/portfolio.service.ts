import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger 
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { 
  CreatePortfolioDto, 
  UpdatePortfolioDto, 
  PortfolioFiltersDto 
} from './dto/portfolio.dto';
import { PortfolioItem, PortfolioCategory, PortfolioItemType } from '../entities/portfolio.entity';

export interface PortfolioResponse {
  id: string;
  worker_id: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  type: PortfolioItemType;
  media_urls: string[];
  tags: string[];
  project_date: string;
  location: string;
  project_budget: number;
  duration: string;
  client_name: string;
  is_published: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  worker?: {
    id: string;
    name: string;
    display_name?: string;
    profile_photo?: string;
  };
}

export interface PortfolioListResponse {
  items: PortfolioResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: { category: PortfolioCategory; count: number }[];
}

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto, workerId: string): Promise<PortfolioResponse> {
    this.logger.log(`Creating portfolio item for worker ${workerId}`);

    try {
      // Validate worker exists and is actually a worker
      const { data: worker } = await this.supabase
        .client
        .from('user')
        .select('id, role')
        .eq('id', workerId)
        .single();

      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      if (worker.role !== 'worker') {
        throw new BadRequestException('Only workers can create portfolio items');
      }

      // Prepare portfolio data
      const portfolioData = {
        ...createPortfolioDto,
        worker_id: workerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          image_count: createPortfolioDto.media_urls?.length || 0,
          challenges: createPortfolioDto.challenges || [],
          solutions: createPortfolioDto.solutions || [],
          featured_image: createPortfolioDto.media_urls?.[0] || null
        }
      };

      // Create portfolio item
      const { data: portfolio, error } = await this.supabase
        .client
        .from('portfolio_items')
        .insert([portfolioData])
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to create portfolio item:', error);
        throw new InternalServerErrorException('Failed to create portfolio item');
      }

      const enrichedPortfolio = await this.enrichPortfolioWithRelatedData(portfolio);
      return this.formatPortfolioResponse(enrichedPortfolio);
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error creating portfolio item:', error);
      throw new InternalServerErrorException('Failed to create portfolio item');
    }
  }

  async findAll(filters: PortfolioFiltersDto): Promise<PortfolioListResponse> {
    try {
      let query = this.supabase
        .client
        .from('portfolio_items')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.worker_id) {
        query = query.eq('worker_id', filters.worker_id);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }

      // Apply pagination
      const page = Math.max(1, filters.page ?? 1);
      const limit = Math.min(50, Math.max(1, filters.limit ?? 12));
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Apply sorting
      const sortColumn = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order === 'ASC' ? { ascending: true } : { ascending: false };
      query = query.order(sortColumn, sortOrder);

      const { data: items, error, count } = await query;

      if (error) {
        this.logger.error('Failed to fetch portfolio items:', error);
        throw new InternalServerErrorException('Failed to fetch portfolio items');
      }

      // Get category counts
      const { data: categoryCounts } = await this.supabase
        .client
        .from('portfolio_items')
        .select('category')
        .eq('is_published', true);

      const categories = Object.values(PortfolioCategory).map(category => ({
        category,
        count: categoryCounts?.filter(item => item.category === category).length || 0
      }));

      // Enrich items with related data
      const enrichedItems = await Promise.all(
        (items || []).map(item => this.enrichPortfolioWithRelatedData(item))
      );

      const formattedItems = enrichedItems.map(item => this.formatPortfolioResponse(item));
      const totalPages = Math.ceil((count || 0) / limit);

      return {
        items: formattedItems,
        total: count || 0,
        page,
        limit,
        totalPages,
        categories
      };
    } catch (error) {
      this.logger.error('Error in findAll portfolio:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch portfolio items');
    }
  }

  async findOne(id: string): Promise<PortfolioResponse> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid portfolio ID format');
    }

    try {
      const { data: portfolio, error } = await this.supabase
        .client
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !portfolio) {
        this.logger.error('Portfolio item not found:', error);
        throw new NotFoundException('Portfolio item not found');
      }

      // Increment view count
      await this.supabase
        .client
        .from('portfolio_items')
        .update({ 
          views_count: (portfolio.views_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      const enrichedPortfolio = await this.enrichPortfolioWithRelatedData(portfolio);
      return this.formatPortfolioResponse(enrichedPortfolio);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Unexpected error finding portfolio item:', error);
      throw new InternalServerErrorException('Failed to fetch portfolio item');
    }
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto, workerId: string): Promise<PortfolioResponse> {
    try {
      const portfolio = await this.findOne(id);
      
      // Check ownership
      if (portfolio.worker_id !== workerId) {
        throw new ForbiddenException('You can only update your own portfolio items');
      }

      const updateData = {
        ...updatePortfolioDto,
        updated_at: new Date().toISOString()
      };

      const { data: updatedPortfolio, error } = await this.supabase
        .client
        .from('portfolio_items')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to update portfolio item:', error);
        throw new InternalServerErrorException('Failed to update portfolio item');
      }

      const enrichedPortfolio = await this.enrichPortfolioWithRelatedData(updatedPortfolio);
      return this.formatPortfolioResponse(enrichedPortfolio);
    } catch (error) {
      if (error instanceof ForbiddenException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error updating portfolio item:', error);
      throw new InternalServerErrorException('Failed to update portfolio item');
    }
  }

  async remove(id: string, workerId: string): Promise<{ message: string }> {
    try {
      const portfolio = await this.findOne(id);
      
      // Check ownership
      if (portfolio.worker_id !== workerId) {
        throw new ForbiddenException('You can only delete your own portfolio items');
      }

      // Delete associated media from Cloudinary
      if (portfolio.media_urls && portfolio.media_urls.length > 0) {
        for (const mediaUrl of portfolio.media_urls) {
          try {
            const publicId = this.cloudinary.extractPublicId(mediaUrl);
            if (publicId) {
              await this.cloudinary.deleteImage(publicId);
            }
          } catch (error) {
            this.logger.warn('Failed to delete media from Cloudinary:', error);
          }
        }
      }

      const { error } = await this.supabase
        .client
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to delete portfolio item:', error);
        throw new InternalServerErrorException('Failed to delete portfolio item');
      }

      return { message: 'Portfolio item deleted successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error deleting portfolio item:', error);
      throw new InternalServerErrorException('Failed to delete portfolio item');
    }
  }

  async likeItem(id: string, userId: string): Promise<{ likes_count: number; has_liked: boolean }> {
    try {
      const portfolio = await this.findOne(id);

      // Check if user already liked
      const { data: existingLike } = await this.supabase
        .client
        .from('portfolio_likes')
        .select('id')
        .eq('portfolio_item_id', id)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await this.supabase
          .client
          .from('portfolio_likes')
          .delete()
          .eq('id', existingLike.id);

        const newLikesCount = Math.max(0, portfolio.likes_count - 1);
        
        await this.supabase
          .client
          .from('portfolio_items')
          .update({ likes_count: newLikesCount })
          .eq('id', id);

        return { likes_count: newLikesCount, has_liked: false };
      } else {
        // Like
        await this.supabase
          .client
          .from('portfolio_likes')
          .insert([{
            portfolio_item_id: id,
            user_id: userId,
            created_at: new Date().toISOString()
          }]);

        const newLikesCount = portfolio.likes_count + 1;
        
        await this.supabase
          .client
          .from('portfolio_items')
          .update({ likes_count: newLikesCount })
          .eq('id', id);

        return { likes_count: newLikesCount, has_liked: true };
      }
    } catch (error) {
      this.logger.error('Error liking portfolio item:', error);
      throw new InternalServerErrorException('Failed to like portfolio item');
    }
  }

  async uploadMedia(file: import('multer').File): Promise<{ url: string }> {
    try {
      const url = await this.cloudinary.uploadImage(file);
      return { url };
    } catch (error) {
      this.logger.error('Failed to upload media:', error);
      throw new InternalServerErrorException('Failed to upload media');
    }
  }

  private async enrichPortfolioWithRelatedData(portfolio: any): Promise<any> {
    const enrichedPortfolio = { ...portfolio };

    try {
      // Fetch worker info
      if (portfolio.worker_id) {
        const { data: worker } = await this.supabase
          .client
          .from('user')
          .select('id, name, metadata, is_verified')
          .eq('id', portfolio.worker_id)
          .single();
        
        if (worker) {
          let parsedMetadata = {};
          if (worker.metadata) {
            try {
              parsedMetadata = typeof worker.metadata === 'string' 
                ? JSON.parse(worker.metadata) 
                : worker.metadata;
            } catch (error) {
              this.logger.warn('Failed to parse worker metadata:', error);
            }
          }
          enrichedPortfolio.worker = { ...worker, parsedMetadata };
        }
      }

    } catch (error) {
      this.logger.error('Failed to enrich portfolio with related data:', error);
    }

    return enrichedPortfolio;
  }

  private formatPortfolioResponse(portfolio: any): PortfolioResponse {
    const response: PortfolioResponse = {
      id: portfolio.id,
      worker_id: portfolio.worker_id,
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      type: portfolio.type,
      media_urls: portfolio.media_urls || [],
      tags: portfolio.tags || [],
      project_date: portfolio.project_date,
      location: portfolio.location,
      project_budget: portfolio.project_budget ? parseFloat(portfolio.project_budget) : 0,
      duration: portfolio.duration,
      client_name: portfolio.client_name,
      is_published: portfolio.is_published,
      views_count: portfolio.views_count,
      likes_count: portfolio.likes_count,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at
    };

    // Add worker info
    if (portfolio.worker) {
      const workerMetadata = portfolio.worker.parsedMetadata || {};
      const profile = workerMetadata.profile || {};
      
      response.worker = {
        id: portfolio.worker.id,
        name: portfolio.worker.name,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : portfolio.worker.name,
        profile_photo: profile.photo || null
      };
    }

    return response;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
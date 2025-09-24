import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateReviewDto, UpdateReviewDto, ReviewFiltersDto } from './dto/review.dto';
import { BookingsService } from '../bookings/bookings.service';

export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface ReviewResponse {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  reviewer?: {
    id: string;
    name: string;
    display_name?: string;
    profile_photo?: string;
    verification_status?: 'verified' | 'unverified';
  };
  reviewee?: {
    id: string;
    name: string;
    display_name?: string;
    profile_photo?: string;
    verification_status?: 'verified' | 'unverified';
  };
  booking?: {
    id: string;
    job_title?: string;
    final_budget?: number;
    completion_date?: string;
  };
}

export interface ReviewListResponse {
  reviews: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number;
  ratingDistribution?: Record<string, number>;
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly bookingsService: BookingsService
  ) {}

  async create(createReviewDto: CreateReviewDto, reviewerId: string): Promise<ReviewResponse> {
    this.logger.log(`Creating review for booking ${createReviewDto.booking_id} by user ${reviewerId}`);

    try {
      // Validate booking exists and user can review
      const canReviewResult = await this.canReview(createReviewDto.booking_id, reviewerId);
      
      if (!canReviewResult.canReview) {
        throw new BadRequestException(canReviewResult.reason || 'You cannot review this booking');
      }

      // Get booking details
      const booking = await this.bookingsService.findOne(createReviewDto.booking_id, reviewerId);
      
      // Validate rating
      if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      // Validate categories if provided
      if (createReviewDto.categories) {
        for (const category of createReviewDto.categories) {
          if (category.rating < 1 || category.rating > 5) {
            throw new BadRequestException(`Category rating for ${category.category} must be between 1 and 5`);
          }
        }
      }

      // Prepare review data
      const reviewData = {
        ...createReviewDto,
        reviewer_id: reviewerId,
        reviewee_id: booking.worker_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create review
      const { data: review, error } = await this.supabase
        .client
        .from('reviews')
        .insert([reviewData])
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to create review:', error);
        throw new InternalServerErrorException('Failed to create review');
      }

      // Update worker's average rating
      await this.updateWorkerRating(booking.worker_id);

      const enrichedReview = await this.enrichReviewWithRelatedData(review);
      return this.formatReviewResponse(enrichedReview);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error creating review:', error);
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  async findOne(id: string, currentUserId: string): Promise<ReviewResponse> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid review ID format');
    }

    try {
      const { data: review, error } = await this.supabase
        .client
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !review) {
        this.logger.error('Review not found:', error);
        throw new NotFoundException('Review not found');
      }

      // Check if user has permission to view this review
      if (!review.is_public && 
          review.reviewer_id !== currentUserId && 
          review.reviewee_id !== currentUserId) {
        throw new ForbiddenException('You do not have permission to view this review');
      }

      const enrichedReview = await this.enrichReviewWithRelatedData(review);
      return this.formatReviewResponse(enrichedReview);
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ForbiddenException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Unexpected error finding review:', error);
      throw new InternalServerErrorException('Failed to fetch review');
    }
  }

  async findAll(filters: ReviewFiltersDto, currentUserId?: string): Promise<ReviewListResponse> {
    try {
      let query = this.supabase
        .client
        .from('reviews')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.reviewee_id) {
        query = query.eq('reviewee_id', filters.reviewee_id);
      }

      if (filters.reviewer_id) {
        query = query.eq('reviewer_id', filters.reviewer_id);
      }

      if (filters.booking_id) {
        query = query.eq('booking_id', filters.booking_id);
      }

      if (filters.min_rating && filters.min_rating >= 1) {
        query = query.gte('rating', filters.min_rating);
      }

      if (filters.max_rating && filters.max_rating <= 5) {
        query = query.lte('rating', filters.max_rating);
      }

      // Only show public reviews unless user is involved
      if (currentUserId && (filters.reviewer_id === currentUserId || filters.reviewee_id === currentUserId)) {
        // User can see their own reviews (public and private)
      } else {
        query = query.eq('is_public', true);
      }

      // Apply pagination
      const page = Math.max(1, filters.page ?? 1);
      const limit = Math.min(50, Math.max(1, filters.limit ?? 10));
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Apply sorting
      const sortColumn = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order === 'ASC' ? { ascending: true } : { ascending: false };
      query = query.order(sortColumn, sortOrder);

      const { data: reviews, error, count } = await query;

      if (error) {
        this.logger.error('Failed to fetch reviews:', error);
        throw new InternalServerErrorException(`Failed to fetch reviews: ${error.message}`);
      }

      // Enrich reviews with related data
      const enrichedReviews = await Promise.all(
        (reviews || []).map(review => this.enrichReviewWithRelatedData(review))
      );

      const formattedReviews = enrichedReviews.map(review => this.formatReviewResponse(review));
      const totalPages = Math.ceil((count || 0) / limit);

      // Calculate average rating and distribution
      let averageRating: number | undefined;
      const ratingDistribution: Record<string, number> = {};

      if (formattedReviews.length > 0) {
        const totalRating = formattedReviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / formattedReviews.length) * 10) / 10;

        // Calculate rating distribution
        [1, 2, 3, 4, 5].forEach(rating => {
          ratingDistribution[rating.toString()] = formattedReviews.filter(r => r.rating === rating).length;
        });
      }

      return {
        reviews: formattedReviews,
        total: count || 0,
        page,
        limit,
        totalPages,
        averageRating,
        ratingDistribution
      };
    } catch (error) {
      this.logger.error('Error in findAll reviews:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch reviews');
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, currentUserId: string): Promise<ReviewResponse> {
    try {
      const review = await this.findOne(id, currentUserId);
      
      // Only reviewer can update
      if (review.reviewer_id !== currentUserId) {
        throw new ForbiddenException('You can only update your own reviews');
      }

      // Validate rating if being updated
      if (updateReviewDto.rating && (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      // Validate categories if being updated
      if (updateReviewDto.categories) {
        for (const category of updateReviewDto.categories) {
          if (category.rating < 1 || category.rating > 5) {
            throw new BadRequestException(`Category rating for ${category.category} must be between 1 and 5`);
          }
        }
      }

      const updateData = {
        ...updateReviewDto,
        updated_at: new Date().toISOString()
      };

      const { data: updatedReview, error } = await this.supabase
        .client
        .from('reviews')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to update review:', error);
        throw new InternalServerErrorException('Failed to update review');
      }

      // Update worker's average rating if rating changed
      if (updateReviewDto.rating) {
        await this.updateWorkerRating(review.reviewee_id);
      }

      const enrichedReview = await this.enrichReviewWithRelatedData(updatedReview);
      return this.formatReviewResponse(enrichedReview);
    } catch (error) {
      if (error instanceof ForbiddenException || 
          error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error updating review:', error);
      throw new InternalServerErrorException('Failed to update review');
    }
  }

  async remove(id: string, currentUserId: string): Promise<{ message: string }> {
    try {
      const review = await this.findOne(id, currentUserId);
      
      // Only reviewer can delete
      if (review.reviewer_id !== currentUserId) {
        throw new ForbiddenException('You can only delete your own reviews');
      }

      const { error } = await this.supabase
        .client
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to delete review:', error);
        throw new InternalServerErrorException('Failed to delete review');
      }

      // Update worker's average rating
      await this.updateWorkerRating(review.reviewee_id);

      return { message: 'Review deleted successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error deleting review:', error);
      throw new InternalServerErrorException('Failed to delete review');
    }
  }

  async canReview(bookingId: string, currentUserId: string): Promise<{ canReview: boolean; reason?: string }> {
    try {
      // Check if booking exists and user is the client
      const booking = await this.bookingsService.findOne(bookingId, currentUserId);
      
      if (booking.client_id !== currentUserId) {
        return { canReview: false, reason: 'Only clients can review workers' };
      }

      // Check if booking is completed
      if (booking.status !== 'completed') {
        return { canReview: false, reason: 'Can only review completed bookings' };
      }

      // Check if review already exists
      const { data: existingReview } = await this.supabase
        .client
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .single();

      if (existingReview) {
        return { canReview: false, reason: 'You have already reviewed this booking' };
      }

      return { canReview: true };
    } catch (error) {
      this.logger.error('Error checking review eligibility:', error);
      return { canReview: false, reason: 'Unable to verify review eligibility' };
    }
  }

  async getWorkerReviews(workerId: string, filters: ReviewFiltersDto): Promise<ReviewListResponse> {
    const filtersWithWorker = {
      ...filters,
      reviewee_id: workerId,
      is_public: true // Only public reviews for worker profile
    };

    return this.findAll(filtersWithWorker);
  }

  private async updateWorkerRating(workerId: string): Promise<void> {
    try {
      // Calculate average rating from all public reviews
      const { data: reviews, error } = await this.supabase
        .client
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', workerId)
        .eq('is_public', true);

      if (error) {
        this.logger.error('Failed to fetch reviews for rating calculation:', error);
        return;
      }

      if (!reviews || reviews.length === 0) {
        return;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

      // Update user metadata with new rating
      const { data: user, error: fetchUserError } = await this.supabase
        .client
        .from('user')
        .select('metadata')
        .eq('id', workerId)
        .single();

      if (fetchUserError || !user) {
        this.logger.error('Failed to fetch user for rating update:', fetchUserError);
        return;
      }

      let metadata = {};
      if (user.metadata) {
        try {
          metadata = typeof user.metadata === 'string' 
            ? JSON.parse(user.metadata) 
            : user.metadata;
        } catch (error) {
          this.logger.warn('Failed to parse user metadata for rating update:', error);
        }
      }

      const updatedMetadata = {
        ...metadata,
        professional: {
          ...(metadata as any).professional || {},
          rating: averageRating,
          total_reviews: reviews.length
        },
        stats: {
          ...(metadata as any).stats || {},
          total_reviews: reviews.length
        }
      };

      await this.supabase
        .client
        .from('user')
        .update({ metadata: updatedMetadata })
        .eq('id', workerId);

    } catch (error) {
      this.logger.error('Failed to update worker rating:', error);
    }
  }

  private async enrichReviewWithRelatedData(review: any): Promise<any> {
    const enrichedReview = { ...review };

    try {
      // Fetch reviewer info
      if (review.reviewer_id) {
        const { data: reviewer } = await this.supabase
          .client
          .from('user')
          .select('id, name, metadata, is_verified')
          .eq('id', review.reviewer_id)
          .single();
        
        if (reviewer) {
          let parsedMetadata = {};
          if (reviewer.metadata) {
            try {
              parsedMetadata = typeof reviewer.metadata === 'string' 
                ? JSON.parse(reviewer.metadata) 
                : reviewer.metadata;
            } catch (error) {
              this.logger.warn('Failed to parse reviewer metadata:', error);
            }
          }
          enrichedReview.reviewer = { ...reviewer, parsedMetadata };
        }
      }

      // Fetch reviewee info
      if (review.reviewee_id) {
        const { data: reviewee } = await this.supabase
          .client
          .from('user')
          .select('id, name, metadata, is_verified')
          .eq('id', review.reviewee_id)
          .single();
        
        if (reviewee) {
          let parsedMetadata = {};
          if (reviewee.metadata) {
            try {
              parsedMetadata = typeof reviewee.metadata === 'string' 
                ? JSON.parse(reviewee.metadata) 
                : reviewee.metadata;
            } catch (error) {
              this.logger.warn('Failed to parse reviewee metadata:', error);
            }
          }
          enrichedReview.reviewee = { ...reviewee, parsedMetadata };
        }
      }

      // Fetch booking info
      if (review.booking_id) {
        const { data: booking } = await this.supabase
          .client
          .from('bookings')
          .select('id, final_budget, actual_completion_date, job_id')
          .eq('id', review.booking_id)
          .single();
        
        if (booking) {
          enrichedReview.booking = booking;
          
          // Fetch job title
          if (booking.job_id) {
            const { data: job } = await this.supabase
              .client
              .from('jobs')
              .select('title')
              .eq('id', booking.job_id)
              .single();
            
            if (job) {
              enrichedReview.booking.job_title = job.title;
            }
          }
        }
      }

    } catch (error) {
      this.logger.error('Failed to enrich review with related data:', error);
    }

    return enrichedReview;
  }

  private formatReviewResponse(review: any): ReviewResponse {
    const response: ReviewResponse = {
      id: review.id,
      booking_id: review.booking_id,
      reviewer_id: review.reviewer_id,
      reviewee_id: review.reviewee_id,
      rating: review.rating,
      comment: review.comment,
      categories: review.categories || [],
      is_public: review.is_public,
      created_at: review.created_at,
      updated_at: review.updated_at
    };

    // Add reviewer info
    if (review.reviewer) {
      const reviewerMetadata = review.reviewer.parsedMetadata || {};
      const profile = reviewerMetadata.profile || {};
      
      response.reviewer = {
        id: review.reviewer.id,
        name: review.reviewer.name,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : review.reviewer.name,
        profile_photo: profile.photo || null,
        verification_status: review.reviewer.is_verified ? 'verified' : 'unverified'
      };
    }

    // Add reviewee info
    if (review.reviewee) {
      const revieweeMetadata = review.reviewee.parsedMetadata || {};
      const profile = revieweeMetadata.profile || {};
      
      response.reviewee = {
        id: review.reviewee.id,
        name: review.reviewee.name,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : review.reviewee.name,
        profile_photo: profile.photo || null,
        verification_status: review.reviewee.is_verified ? 'verified' : 'unverified'
      };
    }

    // Add booking info
    if (review.booking) {
      response.booking = {
        id: review.booking.id,
        job_title: review.booking.job_title,
        final_budget: review.booking.final_budget ? parseFloat(review.booking.final_budget) : undefined,
        completion_date: review.booking.actual_completion_date
      };
    }

    return response;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

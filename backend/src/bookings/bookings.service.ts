import { 
  Injectable, 
  NotFoundException, 
  UnauthorizedException, 
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBookingDto, UpdateBookingDto, BookingFiltersDto } from './dto/bookings.dto';
import { ApplicationsService } from '../applications/applications.service';
import { JobsService } from '../jobs/jobs.service';

export enum BookingStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export interface BookingResponse {
  id: string;
  application_id: string;
  job_id: string;
  client_id: string;
  worker_id: string;
  status: BookingStatus;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  final_budget: number;
  notes?: string;
  completion_proof?: any[];
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  application?: any;
  job?: any;
  client?: any;
  worker?: any;
  review?: any;
  milestone_payments?: any[];
}

export interface BookingListResponse {
  bookings: BookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly applicationsService: ApplicationsService,
    private readonly jobsService: JobsService
  ) {}

  async create(createBookingDto: CreateBookingDto, clientId: string): Promise<BookingResponse> {
    this.logger.log(`Creating booking for client ${clientId} from application ${createBookingDto.application_id}`);

    try {
      // Validate application exists and is accepted
      const application = await this.applicationsService.findOne(createBookingDto.application_id, clientId);
      
      if (application.status !== 'accepted') {
        throw new BadRequestException('Can only create bookings from accepted applications');
      }

      // Check if booking already exists for this application
      const { data: existingBooking } = await this.supabase
        .client
        .from('bookings')
        .select('id')
        .eq('application_id', createBookingDto.application_id)
        .single();

      if (existingBooking) {
        throw new BadRequestException('Booking already exists for this application');
      }

      // Validate dates
      const startDate = new Date(createBookingDto.start_date);
      const expectedCompletion = new Date(createBookingDto.expected_completion_date);
      const today = new Date();
      
      if (startDate < today) {
        throw new BadRequestException('Start date cannot be in the past');
      }

      if (expectedCompletion <= startDate) {
        throw new BadRequestException('Expected completion date must be after start date');
      }

      // Prepare booking data
      const bookingData = {
        ...createBookingDto,
        client_id: clientId,
        worker_id: application.worker_id,
        job_id: application.job_id,
        status: BookingStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create booking
      const { data: booking, error } = await this.supabase
        .client
        .from('bookings')
        .insert([bookingData])
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to create booking:', error);
        throw new InternalServerErrorException('Failed to create booking');
      }

      // Update application with booking_id
      await this.supabase
        .client
        .from('job_applications')
        .update({ booking_id: booking.id })
        .eq('id', createBookingDto.application_id);

      // Update job status
      await this.jobsService.update(application.job_id, {
        status: 'in_progress' as any,
        current_status: 'booked' as any
      }, clientId);

      // Create milestone payments if provided
      if (createBookingDto.milestone_payments && createBookingDto.milestone_payments.length > 0) {
        const milestoneData = createBookingDto.milestone_payments.map(milestone => ({
          ...milestone,
          booking_id: booking.id,
          status: 'pending'
        }));

        await this.supabase
          .client
          .from('milestone_payments')
          .insert(milestoneData);
      }

      const enrichedBooking = await this.enrichBookingWithRelatedData(booking);
      return this.formatBookingResponse(enrichedBooking);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error creating booking:', error);
      throw new InternalServerErrorException('Failed to create booking');
    }
  }

  async findOne(id: string, currentUserId: string): Promise<BookingResponse> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid booking ID format');
    }

    try {
      const { data: booking, error } = await this.supabase
        .client
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !booking) {
        this.logger.error('Booking not found:', error);
        throw new NotFoundException('Booking not found');
      }

      // Check if user has permission to view this booking
      if (booking.client_id !== currentUserId && booking.worker_id !== currentUserId) {
        throw new ForbiddenException('You do not have permission to view this booking');
      }

      const enrichedBooking = await this.enrichBookingWithRelatedData(booking);
      return this.formatBookingResponse(enrichedBooking);
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ForbiddenException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Unexpected error finding booking:', error);
      throw new InternalServerErrorException('Failed to fetch booking');
    }
  }

  async getUserBookings(userId: string, userRole: string, filters: BookingFiltersDto): Promise<BookingListResponse> {
    try {
      let query = this.supabase
        .client
        .from('bookings')
        .select('*', { count: 'exact' });

      // Filter by user role
      if (userRole === 'client') {
        query = query.eq('client_id', userId);
      } else if (userRole === 'worker') {
        query = query.eq('worker_id', userId);
      } else {
        // Admin can see all bookings, apply filters as provided
        if (filters.client_id) {
          query = query.eq('client_id', filters.client_id);
        }
        if (filters.worker_id) {
          query = query.eq('worker_id', filters.worker_id);
        }
      }

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      if (filters.date_from) {
        query = query.gte('start_date', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('expected_completion_date', filters.date_to);
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

      const { data: bookings, error, count } = await query;

      if (error) {
        this.logger.error('Failed to fetch bookings:', error);
        throw new InternalServerErrorException(`Failed to fetch bookings: ${error.message}`);
      }

      // Enrich bookings with related data
      const enrichedBookings = await Promise.all(
        (bookings || []).map(booking => this.enrichBookingWithRelatedData(booking))
      );

      const formattedBookings = enrichedBookings.map(booking => this.formatBookingResponse(booking));
      const totalPages = Math.ceil((count || 0) / limit);

      return {
        bookings: formattedBookings,
        total: count || 0,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      this.logger.error('Error in getUserBookings:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user bookings');
    }
  }

  async findAll(filters: BookingFiltersDto): Promise<BookingListResponse> {
    return this.getUserBookings('', 'admin', filters);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, currentUserId: string): Promise<BookingResponse> {
    try {
      const booking = await this.findOne(id, currentUserId);
      
      // Validate status transitions
      if (updateBookingDto.status && !this.isValidStatusTransition(booking.status, updateBookingDto.status)) {
        throw new BadRequestException(`Cannot change status from ${booking.status} to ${updateBookingDto.status}`);
      }

      // Validate date updates
      if (updateBookingDto.expected_completion_date) {
        const newDate = new Date(updateBookingDto.expected_completion_date);
        const startDate = new Date(booking.start_date);
        
        if (newDate <= startDate) {
          throw new BadRequestException('Expected completion date must be after start date');
        }
      }

      const updateData = {
        ...updateBookingDto,
        updated_at: new Date().toISOString()
      };

      const { data: updatedBooking, error } = await this.supabase
        .client
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to update booking:', error);
        throw new InternalServerErrorException('Failed to update booking');
      }

      const enrichedBooking = await this.enrichBookingWithRelatedData(updatedBooking);
      return this.formatBookingResponse(enrichedBooking);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error updating booking:', error);
      throw new InternalServerErrorException('Failed to update booking');
    }
  }

  async markAsCompleted(id: string, clientId: string, completionProof?: any[]): Promise<BookingResponse> {
    try {
      const booking = await this.findOne(id, clientId);
      
      // Only client can mark as completed
      if (booking.client_id !== clientId) {
        throw new ForbiddenException('Only the client can mark a booking as completed');
      }
      
      if (booking.status !== BookingStatus.ACTIVE) {
        throw new BadRequestException('Can only complete active bookings');
      }

      const updateData: any = {
        status: BookingStatus.COMPLETED,
        actual_completion_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (completionProof && completionProof.length > 0) {
        updateData.completion_proof = completionProof;
      }

      const { data: updatedBooking, error } = await this.supabase
        .client
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to mark booking as completed:', error);
        throw new InternalServerErrorException('Failed to mark booking as completed');
      }

      // Update job status
      await this.jobsService.update(booking.job_id, {
        status: 'completed' as any,
        current_status: 'completed' as any,
        actual_completion_date: new Date().toISOString()
      }, clientId);

      const enrichedBooking = await this.enrichBookingWithRelatedData(updatedBooking);
      return this.formatBookingResponse(enrichedBooking);
    } catch (error) {
      if (error instanceof ForbiddenException || 
          error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error marking booking as completed:', error);
      throw new InternalServerErrorException('Failed to mark booking as completed');
    }
  }

  async cancel(id: string, currentUserId: string, reason?: string): Promise<BookingResponse> {
    try {
      const booking = await this.findOne(id, currentUserId);
      
      if (booking.status !== BookingStatus.ACTIVE) {
        throw new BadRequestException('Can only cancel active bookings');
      }

      const updateData: any = {
        status: BookingStatus.CANCELLED,
        updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.cancellation_reason = reason;
      }

      const { data: updatedBooking, error } = await this.supabase
        .client
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        this.logger.error('Failed to cancel booking:', error);
        throw new InternalServerErrorException('Failed to cancel booking');
      }

      // Update job status back to open
      await this.jobsService.update(booking.job_id, {
        status: 'open' as any,
        current_status: 'open' as any,
      }, booking.client_id);

      const enrichedBooking = await this.enrichBookingWithRelatedData(updatedBooking);
      return this.formatBookingResponse(enrichedBooking);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error('Unexpected error canceling booking:', error);
      throw new InternalServerErrorException('Failed to cancel booking');
    }
  }

  private async enrichBookingWithRelatedData(booking: any): Promise<any> {
    const enrichedBooking = { ...booking };

    try {
      // Fetch application
      if (booking.application_id) {
        const { data: application } = await this.supabase
          .client
          .from('job_applications')
          .select('*')
          .eq('id', booking.application_id)
          .single();
        
        if (application) {
          enrichedBooking.application = application;
        }
      }

      // Fetch job
      if (booking.job_id) {
        const { data: job } = await this.supabase
          .client
          .from('jobs')
          .select('*')
          .eq('id', booking.job_id)
          .single();
        
        if (job) {
          enrichedBooking.job = job;
        }
      }

      // Fetch client
      if (booking.client_id) {
        const { data: client } = await this.supabase
          .client
          .from('user')
          .select('id, name, email, metadata, is_verified')
          .eq('id', booking.client_id)
          .single();
        
        if (client) {
          let parsedMetadata = {};
          if (client.metadata) {
            try {
              parsedMetadata = typeof client.metadata === 'string' 
                ? JSON.parse(client.metadata) 
                : client.metadata;
            } catch (error) {
              this.logger.warn('Failed to parse client metadata:', error);
            }
          }
          enrichedBooking.client = { ...client, parsedMetadata };
        }
      }

      // Fetch worker
      if (booking.worker_id) {
        const { data: worker } = await this.supabase
          .client
          .from('user')
          .select('id, name, email, metadata, is_verified')
          .eq('id', booking.worker_id)
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
          enrichedBooking.worker = { ...worker, parsedMetadata };
        }
      }

      // Fetch review
      const { data: review } = await this.supabase
        .client
        .from('reviews')
        .select('*')
        .eq('booking_id', booking.id)
        .single();
      
      if (review) {
        enrichedBooking.review = review;
      }

      // Fetch milestone payments
      const { data: milestones } = await this.supabase
        .client
        .from('milestone_payments')
        .select('*')
        .eq('booking_id', booking.id)
        .order('due_date', { ascending: true });
      
      if (milestones) {
        enrichedBooking.milestone_payments = milestones;
      }

    } catch (error) {
      this.logger.error('Failed to enrich booking with related data:', error);
    }

    return enrichedBooking;
  }

  private formatBookingResponse(booking: any): BookingResponse {
    const response: BookingResponse = {
      id: booking.id,
      application_id: booking.application_id,
      job_id: booking.job_id,
      client_id: booking.client_id,
      worker_id: booking.worker_id,
      status: booking.status,
      start_date: booking.start_date,
      expected_completion_date: booking.expected_completion_date,
      actual_completion_date: booking.actual_completion_date,
      final_budget: parseFloat(booking.final_budget),
      notes: booking.notes,
      completion_proof: booking.completion_proof || [],
      cancellation_reason: booking.cancellation_reason,
      created_at: booking.created_at,
      updated_at: booking.updated_at
    };

    // Add relations
    if (booking.application) {
      response.application = booking.application;
    }

    if (booking.job) {
      response.job = {
        id: booking.job.id,
        title: booking.job.title,
        description: booking.job.description,
        category: booking.job.category,
        budget_min: parseFloat(booking.job.budget_min),
        budget_max: parseFloat(booking.job.budget_max)
      };
    }

    if (booking.client) {
      const clientMetadata = booking.client.parsedMetadata || {};
      const profile = clientMetadata.profile || {};
      
      response.client = {
        id: booking.client.id,
        name: booking.client.name,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : booking.client.name,
        email: booking.client.email,
        profile_photo: profile.photo || null,
        verification_status: booking.client.is_verified ? 'verified' : 'unverified'
      };
    }

    if (booking.worker) {
      const workerMetadata = booking.worker.parsedMetadata || {};
      const profile = workerMetadata.profile || {};
      
      response.worker = {
        id: booking.worker.id,
        name: booking.worker.name,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : booking.worker.name,
        email: booking.worker.email,
        profile_photo: profile.photo || null,
        rating: workerMetadata.professional?.rating || 4.5,
        skills: workerMetadata.professional?.skills || [],
        verification_status: booking.worker.is_verified ? 'verified' : 'unverified'
      };
    }

    if (booking.review) {
      response.review = booking.review;
    }

    if (booking.milestone_payments) {
      response.milestone_payments = booking.milestone_payments;
    }

    return response;
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      [BookingStatus.ACTIVE]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.DISPUTED],
      [BookingStatus.COMPLETED]: [BookingStatus.DISPUTED],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.DISPUTED]: [BookingStatus.ACTIVE, BookingStatus.COMPLETED, BookingStatus.CANCELLED]
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
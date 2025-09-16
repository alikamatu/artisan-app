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
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto, JobFiltersDto } from './dto/update-job.dto';
import { Job, JobStatus, JobCurrentStatus } from 'src/entities/job.entity';
import { User } from '../entities/user.entity';

export interface JobResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: string;
  start_date?: string;
  estimated_duration?: string;
  status: string;
  current_status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  client_id: string;
  selected_worker_id?: string;
  milestone_updates?: any[];
  actual_start_date?: string;
  actual_completion_date?: string;
  
  // Related data
  client?: {
    id: string;
    name: string;
    email?: string;
    rating?: number;
    total_jobs?: number;
    verification_status?: 'verified' | 'unverified';
    profile_photo?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string;
    preferences?: any;
    payment_method?: string;
  };
  
  selected_worker?: {
    id: string;
    name: string;
    rating?: number;
    skills?: string[];
    profile_photo?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string;
    verification_status?: 'verified' | 'unverified';
  };
}

export interface JobListResponse {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class JobsService {
  constructor(private readonly supabase: SupabaseService) {}
   private readonly logger = new Logger(JobsService.name);

  // ============ CREATE JOB ============

  async create(createJobDto: CreateJobDto, clientId: string): Promise<JobResponse> {
    // Validate client exists and has client role - using user table instead of user
    const { data: client, error: clientError } = await this.supabase
      .client
      .from('user') // Changed from 'user' to 'user'
      .select('id, role, is_verified')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new NotFoundException('Client not found');
    }

    if (client.role !== 'client') {
      throw new ForbiddenException('Only clients can create jobs');
    }

    if (!client.is_verified) {
      throw new UnauthorizedException('Please verify your email before creating jobs');
    }

    // Validate budget range
    if (createJobDto.budget_max < createJobDto.budget_min) {
      throw new BadRequestException('Maximum budget must be greater than or equal to minimum budget');
    }

    // Validate start date (if provided, should not be in the past)
    if (createJobDto.start_date) {
      const startDate = new Date(createJobDto.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new BadRequestException('Start date cannot be in the past');
      }
    }

    // Prepare job data
    const jobData = {
      ...createJobDto,
      client_id: clientId,
      status: JobStatus.OPEN,
      current_status: JobCurrentStatus.OPEN,
      views_count: 0,
      applications_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert job into database - simplified query without relationships
    const { data: job, error } = await this.supabase
      .client
      .from('jobs')
      .insert([jobData])
      .select('*')
      .single();

    if (error) {
      console.error('Failed to create job:', error);
      throw new InternalServerErrorException('Failed to create job');
    }

    // Fetch client info separately if job was created successfully
    const jobWithClient = await this.enrichJobWithRelatedData(job);
    return this.formatJobResponse(jobWithClient);
  }

  // ============ GET JOBS ============

async findOne(id: string, currentUserId?: string): Promise<JobResponse> {
    this.logger.log(`Fetching job with ID: ${id}`);
    
    // Add validation for UUID format
    if (!this.isValidUUID(id)) {
      this.logger.error(`Invalid UUID format: ${id}`);
      throw new BadRequestException('Invalid job ID format');
    }

    try {
      const { data: job, error } = await this.supabase
        .client
        .from('jobs') // Make sure this table name is correct
        .select('*')
        .eq('id', id)
        .single();

      this.logger.log(`Supabase query result:`, { data: job, error });

      if (error) {
        this.logger.error(`Supabase error:`, error);
        
        // Handle specific Supabase errors
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Job not found');
        }
        
        throw new InternalServerErrorException(`Database error: ${error.message}`);
      }

      if (!job) {
        this.logger.warn(`No job found with ID: ${id}`);
        throw new NotFoundException('Job not found');
      }

      this.logger.log(`Job found: ${job.title}`);

      // Increment view count if it's not the job owner
      if (currentUserId && currentUserId !== job.client_id) {
        await this.incrementViewCount(id);
      }

      // Enrich with related data
      const enrichedJob = await this.enrichJobWithRelatedData(job, true);
      return this.formatJobResponse(enrichedJob, true);

    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      this.logger.error(`Unexpected error fetching job:`, error);
      throw new InternalServerErrorException('Failed to fetch job');
    }
  }

private async enrichJobWithRelatedData(job: any, includeDetails: boolean = false): Promise<any> {
  const enrichedJob = { ...job };
  this.logger.log(`Enriching job data for job ID: ${job.id}`);

  try {
    if (job.client_id) {
      this.logger.log(`Fetching client info for ID: ${job.client_id}`);
      
      const { data: client, error: clientError } = await this.supabase
        .client
        .from('user')
        .select('id, name, email, metadata, role, is_verified')
        .eq('id', job.client_id)
        .single();

      if (clientError) {
        this.logger.warn(`Failed to fetch client info:`, clientError);
      } else if (client) {
        this.logger.log(`Client found: ${client.name}`);
        
        // Parse metadata to extract profile photo and other details
        let parsedMetadata: any = {};
        if (client.metadata) {
          try {
            parsedMetadata = typeof client.metadata === 'string' 
              ? JSON.parse(client.metadata) 
              : client.metadata;
          } catch (error) {
            this.logger.warn('Failed to parse client metadata:', error);
            parsedMetadata = {};
          }
        }
        
        // Attach parsed metadata to client object for easier access
        enrichedJob.client = {
          ...client,
          parsedMetadata
        };
        
        this.logger.log(`Client metadata parsed successfully:`, {
          hasProfilePhoto: !!parsedMetadata?.profile?.photo,
          photoUrl: parsedMetadata?.profile?.photo,
          firstName: parsedMetadata?.profile?.firstName,
          lastName: parsedMetadata?.profile?.lastName
        });
      }
    }

    // Handle selected worker if exists
    if (job.selected_worker_id) {
      this.logger.log(`Fetching selected worker info for ID: ${job.selected_worker_id}`);
      
      const { data: worker, error: workerError } = await this.supabase
        .client
        .from('user')
        .select('id, name, email, metadata, role, is_verified')
        .eq('id', job.selected_worker_id)
        .single();

      if (workerError) {
        this.logger.warn(`Failed to fetch worker info:`, workerError);
      } else if (worker) {
        let parsedWorkerMetadata = {};
        if (worker.metadata) {
          try {
            parsedWorkerMetadata = typeof worker.metadata === 'string' 
              ? JSON.parse(worker.metadata) 
              : worker.metadata;
          } catch (error) {
            this.logger.warn('Failed to parse worker metadata:', error);
            parsedWorkerMetadata = {};
          }
        }
        
        enrichedJob.selected_worker = {
          ...worker,
          parsedMetadata: parsedWorkerMetadata
        };
      }
    }

  } catch (error) {
    this.logger.error('Failed to enrich job with related data:', error);
  }

  return enrichedJob;
}

  // ============ UUID VALIDATION ============
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // ============ TEST DATABASE CONNECTION ============
  async testDatabaseConnection(): Promise<any> {
    try {
      this.logger.log('Testing database connection...');
      
      // Test basic connection
      const { data, error } = await this.supabase
        .client
        .from('jobs')
        .select('id, title')
        .limit(1);

      if (error) {
        this.logger.error('Database connection test failed:', error);
        throw new InternalServerErrorException('Database connection failed');
      }

      this.logger.log('Database connection successful');
      return { success: true, sampleData: data };
    } catch (error) {
      this.logger.error('Database connection test error:', error);
      throw error;
    }
  }

// jobs.service.ts - Updated findAll method with proper filtering

async findAll(filters: JobFiltersDto, currentUserId?: string): Promise<JobListResponse> {
  this.logger.log('Fetching jobs with filters:', filters);
  
  try {
    let query = this.supabase
      .client
      .from('jobs')
      .select('*', { count: 'exact' });

    // Apply filters with proper validation
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.current_status) {
      query = query.eq('current_status', filters.current_status);
    }

    // Handle location filtering - updated for new schema
    if (filters.region) {
      query = query.eq('region', filters.region);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    // Handle budget filtering
    if (filters.min_budget && filters.min_budget > 0) {
      query = query.gte('budget_max', filters.min_budget);
    }

    if (filters.max_budget && filters.max_budget > 0) {
      query = query.lte('budget_min', filters.max_budget);
    }

    // FIXED: Handle required_skills filtering with validation
    if (filters.required_skills && Array.isArray(filters.required_skills) && filters.required_skills.length > 0) {
      // Filter out empty strings and ensure minimum length
      const validSkills = filters.required_skills
        .filter(skill => skill && typeof skill === 'string' && skill.trim().length >= 2)
        .map(skill => skill.trim().toLowerCase());
      
      if (validSkills.length > 0) {
        // Use overlaps for array intersection
        query = query.overlaps('required_skills', validSkills);
      }
    }

    if (filters.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }

    // FIXED: Handle search with minimum length validation
    if (filters.search && typeof filters.search === 'string') {
      const searchTerm = filters.search.trim();
      if (searchTerm.length >= 2) { // Minimum 2 characters
        // Use full-text search if available, otherwise use pattern matching
        query = query.or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,required_skills.cs.{${searchTerm}}`
        );
      }
    }

    // Handle rating filter
    if (filters.min_rating && filters.min_rating > 0) {
      // This would require a join with client ratings - for now, we'll skip this
      this.logger.warn('Rating filter not yet implemented - requires client data join');
    }

    // Handle distance filter (if coordinates are available)
    if (filters.max_distance_km && filters.max_distance_km > 0) {
      // This would require geographic calculations - for now, we'll skip this
      this.logger.warn('Distance filter not yet implemented - requires geographic calculations');
    }

    // Handle verified clients filter
    if (filters.verified_clients_only) {
      // This would require a join with client verification status
      this.logger.warn('Verified clients filter not yet implemented - requires client data join');
    }

    // Apply pagination
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(50, Math.max(1, filters.limit ?? 10)); // Limit max results per page
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Apply sorting with validation
    const validSortColumns = ['created_at', 'updated_at', 'budget_min', 'budget_max', 'views_count', 'applications_count', 'urgency'];
    const sortColumn = validSortColumns.includes(filters.sort_by || '') ? filters.sort_by : 'created_at';
    const sortOrder = filters.sort_order === 'ASC' ? { ascending: true } : { ascending: false };
    query = query.order(sortColumn!, sortOrder);

    const { data: jobs, error, count } = await query;

    if (error) {
      this.logger.error('Failed to fetch jobs:', error);
      throw new InternalServerErrorException(`Failed to fetch jobs: ${error.message}`);
    }

    this.logger.log(`Found ${count} total jobs, returning ${jobs?.length} jobs`);

    // Enrich jobs with related data
    const enrichedJobs = await Promise.all(
      (jobs || []).map(job => this.enrichJobWithRelatedData(job, false))
    );

    const formattedJobs = enrichedJobs.map(job => this.formatJobResponse(job));
    const totalPages = Math.ceil((count || 0) / limit);

    return {
      jobs: formattedJobs,
      total: count || 0,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    this.logger.error('Error in findAll:', error);
    if (error instanceof InternalServerErrorException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to fetch jobs');
  }
}

  async update(id: string, updateJobDto: UpdateJobDto, currentUserId: string): Promise<JobResponse> {
    // Get current job
    const { data: currentJob, error: fetchError } = await this.supabase
      .client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentJob) {
      throw new NotFoundException('Job not found');
    }

    // Check if user is the job owner
    if (currentJob.client_id !== currentUserId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    // Validate budget range if both are being updated
    if (updateJobDto.budget_min !== undefined && updateJobDto.budget_max !== undefined) {
      if (updateJobDto.budget_max < updateJobDto.budget_min) {
        throw new BadRequestException('Maximum budget must be greater than or equal to minimum budget');
      }
    }

    // Validate individual budget updates
    if (updateJobDto.budget_min !== undefined && updateJobDto.budget_min > currentJob.budget_max) {
      throw new BadRequestException('Minimum budget cannot be greater than current maximum budget');
    }

    if (updateJobDto.budget_max !== undefined && updateJobDto.budget_max < currentJob.budget_min) {
      throw new BadRequestException('Maximum budget cannot be less than current minimum budget');
    }

    // Validate status transitions
    if (updateJobDto.status && !this.isValidStatusTransition(currentJob.status, updateJobDto.status)) {
      throw new BadRequestException(`Cannot change status from ${currentJob.status} to ${updateJobDto.status}`);
    }

    // Update job
    const updateData = {
      ...updateJobDto,
      updated_at: new Date().toISOString()
    };

    const { data: updatedJob, error } = await this.supabase
      .client
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update job:', error);
      throw new InternalServerErrorException('Failed to update job');
    }

    // Enrich with related data
    const enrichedJob = await this.enrichJobWithRelatedData(updatedJob, true);
    return this.formatJobResponse(enrichedJob);
  }

  // ============ DELETE JOB ============

  async remove(id: string, currentUserId: string): Promise<{ message: string }> {
    // Get current job
    const { data: job, error: fetchError } = await this.supabase
      .client
      .from('jobs')
      .select('client_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user is the job owner
    if (job.client_id !== currentUserId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    // Check if job can be deleted (only open jobs)
    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Cannot delete jobs that are in progress or completed');
    }

    const { error } = await this.supabase
      .client
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete job:', error);
      throw new InternalServerErrorException('Failed to delete job');
    }

    return { message: 'Job deleted successfully' };
  }

  async getClientJobs(clientId: string, filters: JobFiltersDto): Promise<JobListResponse> {
    const filtersWithClient = {
      ...filters,
      client_id: clientId
    };

    return this.findAll(filtersWithClient, clientId);
  }


  private async incrementViewCount(jobId: string): Promise<void> {
    try {
      // Fetch current views_count
      const { data: job, error: fetchError } = await this.supabase
        .client
        .from('jobs')
        .select('views_count')
        .eq('id', jobId)
        .single();

      if (!fetchError && job) {
        await this.supabase
          .client
          .from('jobs')
          .update({ views_count: (job.views_count || 0) + 1 })
          .eq('id', jobId);
      }
    } catch (error) {
      // Silently fail - view count increment is not critical
      console.error('Failed to increment view count:', error);
    }
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      [JobStatus.OPEN]: [JobStatus.IN_PROGRESS, JobStatus.CANCELLED],
      [JobStatus.IN_PROGRESS]: [JobStatus.COMPLETED, JobStatus.CANCELLED],
      [JobStatus.COMPLETED]: [], // Cannot change from completed
      [JobStatus.CANCELLED]: [JobStatus.OPEN] // Can reopen cancelled jobs
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

private formatJobResponse(job: any, includeDetails: boolean = false): JobResponse {
  const response: JobResponse = {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    budget_min: parseFloat(job.budget_min),
    budget_max: parseFloat(job.budget_max),
    required_skills: job.required_skills || [],
    urgency: job.urgency,
    start_date: job.start_date,
    estimated_duration: job.estimated_duration,
    status: job.status,
    current_status: job.current_status,
    views_count: job.views_count || 0,
    applications_count: job.applications_count || 0,
    created_at: job.created_at,
    updated_at: job.updated_at,
    client_id: job.client_id,
    selected_worker_id: job.selected_worker_id,
    milestone_updates: job.milestone_updates || [],
    actual_start_date: job.actual_start_date,
    actual_completion_date: job.actual_completion_date
  };

    // Add client info
   if (job.client) {
    const clientMetadata = job.client.parsedMetadata || {};
    const profile = clientMetadata.profile || {};
    
    response.client = {
      id: job.client.id,
      name: job.client.name,
      rating: clientMetadata.profile?.rating || 4.2,
      total_jobs: clientMetadata.stats?.total_jobs_posted || 0,
      verification_status: job.client.is_verified ? 'verified' : 'unverified',
      // Add profile photo and other profile details
      profile_photo: profile.photo || null,
      first_name: profile.firstName || null,
      last_name: profile.lastName || null,
      // Construct full name if available
      display_name: profile.firstName && profile.lastName 
        ? `${profile.firstName} ${profile.lastName}`
        : job.client.name
    };

    if (includeDetails) {
      response.client.email = job.client.email;
      // Add additional metadata if needed
      response.client.preferences = clientMetadata.preferences || null;
      response.client.payment_method = clientMetadata.payment?.method || null;
    }
  }
    // Add selected worker info
  if (job.selected_worker) {
    const workerMetadata = job.selected_worker.parsedMetadata || {};
    const workerProfile = workerMetadata.profile || {};
    
    response.selected_worker = {
      id: job.selected_worker.id,
      name: job.selected_worker.name,
      rating: workerMetadata.professional?.rating || 4.5,
      skills: workerMetadata.professional?.skills || [],
      profile_photo: workerProfile.photo || null,
      first_name: workerProfile.firstName || null,
      last_name: workerProfile.lastName || null,
      display_name: workerProfile.firstName && workerProfile.lastName 
        ? `${workerProfile.firstName} ${workerProfile.lastName}`
        : job.selected_worker.name,
      verification_status: job.selected_worker.is_verified ? 'verified' : 'unverified'
    };
  }

    return response;
  }
}
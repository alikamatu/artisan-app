// applications.service.ts
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
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationFiltersDto } from './dto/update-application.dto';
import { JobsService } from '../jobs/jobs.service';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface ApplicationResponse {
  id: string;
  job_id: string;
  worker_id: string;
  cover_letter: string;
  proposed_budget: number;
  estimated_completion_time: string;
  availability_start_date: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  
  // Related data
  worker?: {
    id: string;
    name: string;
    rating?: number;
    total_jobs_completed?: number;
    skills?: string[];
    profile_photo?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string;
    verification_status?: 'verified' | 'unverified';
    location?: {
      region: string;
      city: string;
    };
  };
  
  job?: {
    id: string;
    title: string;
    budget_min: number;
    budget_max: number;
    status: string;
    client_id: string;
  };
}

export interface ApplicationListResponse {
  applications: ApplicationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly jobsService: JobsService
  ) {}

  // ============ CREATE APPLICATION ============

  async create(createApplicationDto: CreateApplicationDto, workerId: string): Promise<ApplicationResponse> {
    this.logger.log(`Creating application for worker ${workerId} to job ${createApplicationDto.job_id}`);

    // Validate worker exists and has worker role
    const { data: worker, error: workerError } = await this.supabase
      .client
      .from('user')
      .select('id, role, is_verified')
      .eq('id', workerId)
      .single();

    if (workerError || !worker) {
      throw new NotFoundException('Worker not found');
    }

    if (worker.role !== 'worker') {
      throw new ForbiddenException('Only workers can apply to jobs');
    }

    if (!worker.is_verified) {
      throw new UnauthorizedException('Please verify your email before applying to jobs');
    }

    // Validate job exists and is open
    const job = await this.jobsService.findOne(createApplicationDto.job_id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'open') {
      throw new BadRequestException('Cannot apply to jobs that are not open');
    }

    // Check if worker is the job owner (can't apply to own job)
    if (job.client_id === workerId) {
      throw new BadRequestException('You cannot apply to your own job');
    }

    // Check if worker has already applied
    const existingApplication = await this.checkApplicationExists(createApplicationDto.job_id, workerId);
    if (existingApplication.hasApplied) {
      throw new BadRequestException('You have already applied to this job');
    }

    // Validate proposed budget is within job range
    if (createApplicationDto.proposed_budget < job.budget_min || 
        createApplicationDto.proposed_budget > job.budget_max) {
      throw new BadRequestException(
        `Proposed budget must be between GHS ${job.budget_min} and GHS ${job.budget_max}`
      );
    }

    // Validate availability start date
    const startDate = new Date(createApplicationDto.availability_start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      throw new BadRequestException('Availability start date cannot be in the past');
    }

    // Prepare application data
    const applicationData = {
      ...createApplicationDto,
      worker_id: workerId,
      status: ApplicationStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert application
    const { data: application, error } = await this.supabase
      .client
      .from('job_applications')
      .insert([applicationData])
      .select('*')
      .single();

    if (error) {
      this.logger.error('Failed to create application:', error);
      throw new InternalServerErrorException('Failed to create application');
    }

    // Increment applications count on the job
    await this.incrementJobApplicationsCount(createApplicationDto.job_id);

    // Enrich with related data
    const enrichedApplication = await this.enrichApplicationWithRelatedData(application);
    return this.formatApplicationResponse(enrichedApplication);
  }

  // ============ GET APPLICATIONS ============

  async findOne(id: string, currentUserId: string): Promise<ApplicationResponse> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid application ID format');
    }

    const { data: application, error } = await this.supabase
      .client
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !application) {
      throw new NotFoundException('Application not found');
    }

    // Check if user has permission to view this application
    // (worker who applied, or job owner)
    const job = await this.jobsService.findOne(application.job_id);
    if (application.worker_id !== currentUserId && job.client_id !== currentUserId) {
      throw new ForbiddenException('You do not have permission to view this application');
    }

    const enrichedApplication = await this.enrichApplicationWithRelatedData(application);
    return this.formatApplicationResponse(enrichedApplication);
  }

  async getWorkerApplications(workerId: string, filters: ApplicationFiltersDto): Promise<ApplicationListResponse> {
    const filtersWithWorker = {
      ...filters,
      worker_id: workerId
    };

    return this.findAll(filtersWithWorker);
  }

  async getJobApplications(jobId: string, clientId: string, filters: ApplicationFiltersDto): Promise<ApplicationListResponse> {
    // Verify the client owns the job
    const job = await this.jobsService.findOne(jobId);
    if (job.client_id !== clientId) {
      throw new ForbiddenException('You can only view applications for your own jobs');
    }

    const filtersWithJob = {
      ...filters,
      job_id: jobId
    };

    return this.findAll(filtersWithJob);
  }

  // Add this method to your applications.service.ts

async getClientApplications(clientId: string, filters: ApplicationFiltersDto): Promise<ApplicationListResponse> {
  this.logger.log('Fetching applications for client jobs:', clientId);
  
  try {
    // First, get all job IDs for this client
    const { data: clientJobs, error: jobsError } = await this.supabase
      .client
      .from('jobs')
      .select('id')
      .eq('client_id', clientId);

    if (jobsError) {
      this.logger.error('Failed to fetch client jobs:', jobsError);
      throw new InternalServerErrorException('Failed to fetch client jobs');
    }

    if (!clientJobs || clientJobs.length === 0) {
      return {
        applications: [],
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: 0
      };
    }

    const jobIds = clientJobs.map(job => job.id);

    // Build query for applications on client's jobs
    let query = this.supabase
      .client
      .from('job_applications')
      .select('*', { count: 'exact' })
      .in('job_id', jobIds);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
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

    const { data: applications, error, count } = await query;

    if (error) {
      this.logger.error('Failed to fetch client applications:', error);
      throw new InternalServerErrorException(`Failed to fetch applications: ${error.message}`);
    }

    // Enrich applications with related data
    const enrichedApplications = await Promise.all(
      (applications || []).map(app => this.enrichApplicationWithRelatedData(app))
    );

    const formattedApplications = enrichedApplications.map(app => this.formatApplicationResponse(app));
    const totalPages = Math.ceil((count || 0) / limit);

    return {
      applications: formattedApplications,
      total: count || 0,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    this.logger.error('Error in getClientApplications:', error);
    if (error instanceof InternalServerErrorException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to fetch client applications');
  }
}

  async findAll(filters: ApplicationFiltersDto): Promise<ApplicationListResponse> {
    this.logger.log('Fetching applications with filters:', filters);
    
    try {
      let query = this.supabase
        .client
        .from('job_applications')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      if (filters.worker_id) {
        query = query.eq('worker_id', filters.worker_id);
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

      const { data: applications, error, count } = await query;

      if (error) {
        this.logger.error('Failed to fetch applications:', error);
        throw new InternalServerErrorException(`Failed to fetch applications: ${error.message}`);
      }

      // Enrich applications with related data
      const enrichedApplications = await Promise.all(
        (applications || []).map(app => this.enrichApplicationWithRelatedData(app))
      );

      const formattedApplications = enrichedApplications.map(app => this.formatApplicationResponse(app));
      const totalPages = Math.ceil((count || 0) / limit);

      return {
        applications: formattedApplications,
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
      throw new InternalServerErrorException('Failed to fetch applications');
    }
  }

  // ============ UPDATE APPLICATION STATUS ============

  async acceptApplication(id: string, clientId: string): Promise<ApplicationResponse> {
    const application = await this.findOne(id, clientId);
    
    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Can only accept pending applications');
    }

    // Update application status
    const { data: updatedApplication, error } = await this.supabase
      .client
      .from('job_applications')
      .update({
        status: ApplicationStatus.ACCEPTED,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to accept application');
    }

    // Update job with selected worker and change status
    await this.jobsService.update(application.job_id, {
      selected_worker_id: application.worker_id,
      status: 'in_progress' as any,
      current_status: 'accepted' as any
    }, clientId);

    // Reject all other pending applications for this job
    await this.rejectOtherApplications(application.job_id, id);

    const enrichedApplication = await this.enrichApplicationWithRelatedData(updatedApplication);
    return this.formatApplicationResponse(enrichedApplication);
  }

  async rejectApplication(id: string, clientId: string, reason?: string): Promise<ApplicationResponse> {
    const application = await this.findOne(id, clientId);
    
    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Can only reject pending applications');
    }

    const updateData: any = {
      status: ApplicationStatus.REJECTED,
      updated_at: new Date().toISOString()
    };

    if (reason) {
      updateData.rejection_reason = reason;
    }

    const { data: updatedApplication, error } = await this.supabase
      .client
      .from('job_applications')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to reject application');
    }

    const enrichedApplication = await this.enrichApplicationWithRelatedData(updatedApplication);
    return this.formatApplicationResponse(enrichedApplication);
  }

  async withdrawApplication(id: string, workerId: string): Promise<ApplicationResponse> {
    const { data: application, error: fetchError } = await this.supabase
      .client
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      throw new NotFoundException('Application not found');
    }

    if (application.worker_id !== workerId) {
      throw new ForbiddenException('You can only withdraw your own applications');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Can only withdraw pending applications');
    }

    const { data: updatedApplication, error } = await this.supabase
      .client
      .from('job_applications')
      .update({
        status: ApplicationStatus.WITHDRAWN,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to withdraw application');
    }

    // Decrement applications count on the job
    await this.decrementJobApplicationsCount(application.job_id);

    const enrichedApplication = await this.enrichApplicationWithRelatedData(updatedApplication);
    return this.formatApplicationResponse(enrichedApplication);
  }

  // ============ UTILITY METHODS ============

  async checkApplicationExists(jobId: string, workerId: string): Promise<{ hasApplied: boolean; applicationId?: string; status?: ApplicationStatus }> {
    const { data: application, error } = await this.supabase
      .client
      .from('job_applications')
      .select('id, status')
      .eq('job_id', jobId)
      .eq('worker_id', workerId)
      .maybeSingle();

    if (error) {
      this.logger.error('Error checking application existence:', error);
      return { hasApplied: false };
    }

    return {
      hasApplied: !!application,
      applicationId: application?.id,
      status: application?.status as ApplicationStatus
    };
  }

  private async enrichApplicationWithRelatedData(application: any): Promise<any> {
    const enrichedApplication = { ...application };

    try {
      // Fetch worker info
      if (application.worker_id) {
        const { data: worker, error: workerError } = await this.supabase
          .client
          .from('user')
          .select('id, name, email, metadata, role, is_verified')
          .eq('id', application.worker_id)
          .single();

        if (!workerError && worker) {
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

          enrichedApplication.worker = {
            ...worker,
            parsedMetadata
          };
        }
      }

      // Fetch basic job info
      if (application.job_id) {
        const { data: job, error: jobError } = await this.supabase
          .client
          .from('jobs')
          .select('id, title, budget_min, budget_max, status, client_id')
          .eq('id', application.job_id)
          .single();

        if (!jobError && job) {
          enrichedApplication.job = job;
        }
      }

    } catch (error) {
      this.logger.error('Failed to enrich application with related data:', error);
    }

    return enrichedApplication;
  }

  private formatApplicationResponse(application: any): ApplicationResponse {
    const response: ApplicationResponse = {
      id: application.id,
      job_id: application.job_id,
      worker_id: application.worker_id,
      cover_letter: application.cover_letter,
      proposed_budget: parseFloat(application.proposed_budget),
      estimated_completion_time: application.estimated_completion_time,
      availability_start_date: application.availability_start_date,
      status: application.status,
      created_at: application.created_at,
      updated_at: application.updated_at,
      rejection_reason: application.rejection_reason
    };

    // Add worker info
    if (application.worker) {
      const workerMetadata = application.worker.parsedMetadata || {};
      const profile = workerMetadata.profile || {};

      response.worker = {
        id: application.worker.id,
        name: application.worker.name,
        rating: workerMetadata.professional?.rating || 4.5,
        total_jobs_completed: workerMetadata.stats?.total_jobs_completed || 0,
        skills: workerMetadata.professional?.skills || [],
        profile_photo: profile.photo || null,
        first_name: profile.firstName || null,
        last_name: profile.lastName || null,
        display_name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : application.worker.name,
        verification_status: application.worker.is_verified ? 'verified' : 'unverified',
        location: {
          region: workerMetadata.location?.region || 'unknown',
          city: workerMetadata.location?.city || 'unknown'
        }
      };
    }

    // Add job info
    if (application.job) {
      response.job = {
        id: application.job.id,
        title: application.job.title,
        budget_min: parseFloat(application.job.budget_min),
        budget_max: parseFloat(application.job.budget_max),
        status: application.job.status,
        client_id: application.job.client_id
      };
    }

    return response;
  }

  private async rejectOtherApplications(jobId: string, acceptedApplicationId: string): Promise<void> {
    try {
      await this.supabase
        .client
        .from('job_applications')
        .update({
          status: ApplicationStatus.REJECTED,
          updated_at: new Date().toISOString(),
          rejection_reason: 'Another applicant was selected'
        })
        .eq('job_id', jobId)
        .eq('status', ApplicationStatus.PENDING)
        .neq('id', acceptedApplicationId);
    } catch (error) {
      this.logger.error('Failed to reject other applications:', error);
    }
  }

  private async incrementJobApplicationsCount(jobId: string): Promise<void> {
    try {
      const { data: job } = await this.supabase
        .client
        .from('jobs')
        .select('applications_count')
        .eq('id', jobId)
        .single();

      if (job) {
        await this.supabase
          .client
          .from('jobs')
          .update({ applications_count: (job.applications_count || 0) + 1 })
          .eq('id', jobId);
      }
    } catch (error) {
      this.logger.error('Failed to increment applications count:', error);
    }
  }

  private async decrementJobApplicationsCount(jobId: string): Promise<void> {
    try {
      const { data: job } = await this.supabase
        .client
        .from('jobs')
        .select('applications_count')
        .eq('id', jobId)
        .single();

      if (job) {
        await this.supabase
          .client
          .from('jobs')
          .update({ applications_count: Math.max(0, (job.applications_count || 0) - 1) })
          .eq('id', jobId);
      }
    } catch (error) {
      this.logger.error('Failed to decrement applications count:', error);
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
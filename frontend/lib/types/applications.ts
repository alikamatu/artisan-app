export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface JobApplication {
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
  rejection_reason: string;
  booking_id?: string | null;
  booking_status?: string | null;
  booking: {
    id: string;
    status: string;
    completion_date?: string | null;
    review?: string | null;
    rated_at?: string | null;
    rating?: {
      id: string;
      overall_rating: number;
    } | null;
  } | null;
  
  // Related data
  worker?: {
    id: string;
    name: string;
    email?: string;
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
  };
}

export interface CreateApplicationData {
  job_id: string;
  cover_letter: string;
  proposed_budget: number;
  estimated_completion_time: string;
  availability_start_date: string;
}

export interface ApplicationListResponse {
  applications: JobApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  job_id?: string;
  worker_id?: string;
  sort_by?: 'created_at' | 'proposed_budget';
  sort_order?: 'ASC' | 'DESC';
}

export interface UseApplicationsResult {
  applications: JobApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCreateApplicationResult {
  createApplication: (data: CreateApplicationData) => Promise<JobApplication>;
  isLoading: boolean;
  error: string | null;
}
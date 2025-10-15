// types/jobs.ts
export enum JobStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum JobCurrentStatus {
  OPEN = 'open',
  PROPOSED = 'proposed',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum JobUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum JobCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  TUTORING = 'tutoring',
  CLEANING = 'cleaning',
  CARPENTRY = 'carpentry',
  PAINTING = 'painting',
  GARDENING = 'gardening',
  REPAIRS = 'repairs',
  DELIVERY = 'delivery',
  TECH_SUPPORT = 'tech_support',
  PERSONAL_CARE = 'personal_care',
  AUTOMOTIVE = 'automotive',
  BEAUTY = 'beauty',
  FITNESS = 'fitness',
  EVENT_PLANNING = 'event_planning',
  PHOTOGRAPHY = 'photography',
  WRITING = 'writing',
  TRANSLATION = 'translation',
  LEGAL = 'legal',
  ACCOUNTING = 'accounting',
  OTHER = 'other'
}

export enum GhanaRegion {
  GREATER_ACCRA = 'greater_accra',
  ASHANTI = 'ashanti',
  WESTERN = 'western',
  CENTRAL = 'central',
  VOLTA = 'volta',
  EASTERN = 'eastern',
  NORTHERN = 'northern',
  UPPER_EAST = 'upper_east',
  UPPER_WEST = 'upper_west',
  BRONG_AHAFO = 'brong_ahafo',
  WESTERN_NORTH = 'western_north',
  AHAFO = 'ahafo',
  BONO = 'bono',
  BONO_EAST = 'bono_east',
  OTI = 'oti',
  SAVANNAH = 'savannah',
  NORTH_EAST = 'north_east'
}

export interface CategoryInfo {
  id: JobCategory;
  name: string;
  description: string;
  icon: string;
  commonSkills: string[];
}

export interface RegionInfo {
  id: GhanaRegion;
  name: string;
  cities: string[];
  popularAreas: string[];
}

export interface ClientInfo {
  id: string;
  name: string;
  email?: string;
  rating?: number;
  total_jobs?: number;
  verification_status?: 'verified' | 'unverified';
  location?: {
    region: GhanaRegion;
    city: string;
  };
  // New profile photo fields
  profile_photo?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string;
  preferences?: {
    categories?: string[];
    budget_range?: [number, number];
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  payment_method?: string;
}

export interface SelectedWorkerInfo {
  id: string;
  name: string;
  rating?: number;
  skills?: string[];
  categories?: JobCategory[];
  location?: {
    region: GhanaRegion;
    city: string;
  };
  availability?: {
    immediate: boolean;
    scheduled_dates?: string[];
  };
  verification_status?: 'verified' | 'unverified';
  // New profile photo fields
  profile_photo?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: {
    region: GhanaRegion;
    city: string;
    specific_address?: string;
    latitude?: number;
    longitude?: number;
  };
  category: JobCategory;
  subcategory?: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: JobUrgency;
  start_date?: string;
  estimated_duration?: string;
  status: JobStatus;
  current_status: JobCurrentStatus;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  client_id: string;
  selected_worker_id?: string;
  milestone_updates?: any[];
  actual_start_date?: string;
  actual_completion_date?: string;
  client?: ClientInfo;
  selected_worker?: SelectedWorkerInfo;
  availability_requirement?: {
    immediate: boolean;
    flexible_timing: boolean;
    specific_times?: string[];
  };
  distance_preference?: {
    max_distance_km?: number;
    travel_compensation?: boolean;
  };
}

export interface JobResponse {
    id: string;
  title: string;
  description: string;
  location: {
    region: GhanaRegion;
    city: string;
    specific_address?: string;
    latitude?: number;
    longitude?: number;
  };
  category: JobCategory;
  subcategory?: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: JobUrgency;
  start_date?: string;
  estimated_duration?: string;
  status: JobStatus;
  current_status: JobCurrentStatus;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  client_id: string;
  selected_worker_id?: string;
  milestone_updates?: any[];
  actual_start_date?: string;
  actual_completion_date?: string;
  client?: ClientInfo;
  selected_worker?: SelectedWorkerInfo;
  availability_requirement?: {
    immediate: boolean;
    flexible_timing: boolean;
    specific_times?: string[];
  };
  distance_preference?: {
    max_distance_km?: number;
    travel_compensation?: boolean;
  };
}

export interface JobListResponse {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters_applied?: {
    category?: JobCategory;
    region?: GhanaRegion;
    rating_threshold?: number;
    availability?: string;
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  location: {
    region: GhanaRegion;
    city: string;
    specific_address?: string;
  };
  category: JobCategory;
  region: GhanaRegion;
  subcategory?: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: JobUrgency;
  start_date?: string;
  estimated_duration?: string;
  availability_requirement?: {
    immediate: boolean;
    flexible_timing: boolean;
    specific_times?: string[];
  };
  distance_preference?: {
    max_distance_km?: number;
    travel_compensation?: boolean;
  };
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  location?: {
    region?: GhanaRegion;
    city?: string;
    specific_address?: string;
  };
  category?: JobCategory;
  subcategory?: string;
  budget_min?: number;
  budget_max?: number;
  required_skills?: string[];
  urgency?: JobUrgency;
  start_date?: string;
  estimated_duration?: string;
  status?: JobStatus;
  current_status?: JobCurrentStatus;
  availability_requirement?: {
    immediate?: boolean;
    flexible_timing?: boolean;
    specific_times?: string[];
  };
  distance_preference?: {
    max_distance_km?: number;
    travel_compensation?: boolean;
  };
}

export interface JobFilters {
  page?: number;
  limit?: number;
  status?: JobStatus;
  current_status?: JobCurrentStatus;
  category?: JobCategory;
  subcategory?: string;
  region?: GhanaRegion;
  city?: string;
  min_budget?: number;
  max_budget?: number;
  required_skills?: string[];
  urgency?: JobUrgency;
  client_id?: string;
  search?: string;
  sort_by?: 'created_at' | 'budget_min' | 'budget_max' | 'views_count' | 'applications_count' | 'rating' | 'distance';
  sort_order?: 'ASC' | 'DESC';
  // Enhanced search filters
  availability_filter?: 'immediate' | 'scheduled' | 'flexible';
  min_rating?: number;
  min_review_count?: number;
  max_distance_km?: number;
  verified_clients_only?: boolean;
  with_reviews_only?: boolean;
}

export interface UseJobsResult {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseJobResult {
  job: JobResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCreateJobResult {
  createJob: (data: CreateJobData) => Promise<JobResponse>;
  isLoading: boolean;
  error: string | null;
}

export interface UseUpdateJobResult {
  updateJob: (id: string, data: UpdateJobData) => Promise<JobResponse>;
  isLoading: boolean;
  error: string | null;
}

export interface UseDeleteJobResult {
  deleteJob: (id: string) => Promise<{ message: string }>;
  isLoading: boolean;
  error: string | null;
}
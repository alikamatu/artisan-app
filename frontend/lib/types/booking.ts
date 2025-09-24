export enum BookingStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export interface Booking {
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
  milestone_payments?: MilestonePayment[];
  notes?: string;
  completion_proof?: CompletionProof[];
  created_at: string;
  updated_at: string;
  
  // Relations
  application?: any;
  job?: any;
  client?: any;
  worker?: any;
  review?: Review | null;
}

export interface MilestonePayment {
  id: string;
  booking_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_at?: string;
}

export interface CompletionProof {
  id: string;
  booking_id: string;
  type: 'image' | 'document' | 'video' | 'text';
  url?: string;
  description: string;
  uploaded_at: string;
}

export interface Review {
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
  reviewer?: any;
  reviewee?: any;
  booking?: Booking;
}

export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface CreateBookingData {
  application_id: string;
  start_date: string;
  expected_completion_date: string;
  final_budget: number;
  notes?: string;
  milestone_payments?: Omit<MilestonePayment, 'id' | 'booking_id' | 'status' | 'paid_at'>[];
}

export interface UpdateBookingData {
  status?: BookingStatus;
  expected_completion_date?: string;
  actual_completion_date?: string;
  notes?: string;
}

export interface CreateReviewData {
  booking_id: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  is_public?: boolean;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  client_id?: string;
  worker_id?: string;
  job_id?: string;
  sort_by?: 'created_at' | 'start_date' | 'expected_completion_date' | 'final_budget';
  sort_order?: 'ASC' | 'DESC';
  date_from?: string;
  date_to?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
import { Booking, BookingStatus, CompletionProof, CreateReviewData } from './booking';

export interface BookingManagementProps {
  userRole: 'client' | 'worker';
  userId: string;
}

export interface BookingCardProps {
  booking: Booking;
  userRole: 'client' | 'worker';
  onMarkComplete: (id: string, proof: CompletionProof[]) => Promise<void>;
  onCancel: (id: string, reason: string) => Promise<void>;
  onCreateReview: (data: CreateReviewData) => Promise<void>;
  onStartWork: (id: string) => Promise<void>;
  onPauseWork: (id: string) => Promise<void>;
  onReportIssue: (id: string, reason: string) => Promise<void>;
  onRequestPayment: (id: string) => Promise<void>;
}

export interface BookingFilters {
  page: number;
  limit: number;
  status?: BookingStatus;
  sort_by: 'created_at' | 'start_date' | 'expected_completion_date' | 'final_budget';
  sort_order: 'ASC' | 'DESC';
}

export interface BookingStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  disputed: number;
  totalRevenue: number;
  avgRating: number;
}
export interface Rating {
  id: string;
  job_id: string;
  worker_id: string;
  client_id: string;
  booking_id: string;
  overall_rating: number;
  categories: {
    quality: number;
    communication: number;
    timeliness: number;
    professionalism: number;
  };
  review: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  job?: {
    id: string;
    title: string;
  };
  worker?: {
    id: string;
    display_name: string;
    profile_photo?: string;
  };
}

export interface CreateRatingData {
  job_id: string;
  worker_id: string;
  booking_id: string;
  overall_rating: number;
  categories: {
    quality: number;
    communication: number;
    timeliness: number;
    professionalism: number;
  };
  review: string;
  is_public: boolean;
}

export interface RatingFilters {
  page?: number;
  limit?: number;
  worker_id?: string;
  client_id?: string;
  job_id?: string;
  min_rating?: number;
  sort_by?: 'created_at' | 'overall_rating';
  sort_order?: 'ASC' | 'DESC';
}

export interface RatingListResponse {
  ratings: Rating[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number;
  ratingDistribution?: {
    [key: number]: number;
  };
}
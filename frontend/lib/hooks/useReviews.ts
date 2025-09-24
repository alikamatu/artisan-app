// lib/hooks/useReviews.ts
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';
import { Review, CreateReviewData } from '../types/booking';

interface ReviewFilters {
  page?: number;
  limit?: number;
  reviewee_id?: string;
  reviewer_id?: string;
  booking_id?: string;
  min_rating?: number;
  max_rating?: number;
  is_public?: boolean;
  sort_by?: 'created_at' | 'rating';
  sort_order?: 'ASC' | 'DESC';
}

interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number;
  ratingDistribution?: Record<string, number>;
}

const reviewsApi = {
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create review: ${response.status}`);
    }

    return response.json();
  },

  async getReviews(filters: ReviewFilters = {}): Promise<ReviewListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_CONFIG.baseURL}/reviews?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch reviews: ${response.status}`);
    }

    return response.json();
  },

  async getReview(id: string): Promise<Review> {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch review: ${response.status}`);
    }

    return response.json();
  },

  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review> {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update review: ${response.status}`);
    }

    return response.json();
  },

  async deleteReview(id: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete review: ${response.status}`);
    }
  },

  async canReview(bookingId: string): Promise<{ canReview: boolean; reason?: string }> {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/can-review/${bookingId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to check review eligibility: ${response.status}`);
    }

    return response.json();
  }
};

export const useCreateReview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = useCallback(async (data: CreateReviewData): Promise<Review> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.createReview(data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createReview,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export const useReviews = (filters: ReviewFilters = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [averageRating, setAverageRating] = useState<number | undefined>();
  const [ratingDistribution, setRatingDistribution] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.getReviews(filters);
      setReviews(response.reviews);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
      setAverageRating(response.averageRating);
      setRatingDistribution(response.ratingDistribution || {});
    } catch (err) {
      setError(handleApiError(err));
      setReviews([]);
      setTotal(0);
      setTotalPages(0);
      setAverageRating(undefined);
      setRatingDistribution({});
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages,
    averageRating,
    ratingDistribution,
    isLoading,
    error,
    refetch: fetchReviews
  };
};

export const useReview = (id: string) => {
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.getReview(id);
      setReview(response);
    } catch (err) {
      setError(handleApiError(err));
      setReview(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  return {
    review,
    isLoading,
    error,
    refetch: fetchReview
  };
};

export const useReviewActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReview = useCallback(async (id: string, data: Partial<CreateReviewData>): Promise<Review> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.updateReview(id, data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await reviewsApi.deleteReview(id);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateReview,
    deleteReview,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export const useCanReview = (bookingId: string) => {
  const [canReview, setCanReview] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkReviewEligibility = useCallback(async () => {
    if (!bookingId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.canReview(bookingId);
      setCanReview(response.canReview);
      setReason(response.reason);
    } catch (err) {
      setError(handleApiError(err));
      setCanReview(false);
      setReason(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    checkReviewEligibility();
  }, [checkReviewEligibility]);

  return {
    canReview,
    reason,
    isLoading,
    error,
    refetch: checkReviewEligibility
  };
};

export { reviewsApi };
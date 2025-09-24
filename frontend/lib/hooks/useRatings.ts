"use client";

import { useState, useEffect, useCallback } from 'react';
import { CreateRatingData, Rating, RatingFilters, RatingListResponse } from '../types/rating';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';

const ratingsApi = {
  async createRating(data: CreateRatingData): Promise<Rating> {
    const response = await fetch(`${API_CONFIG.baseURL}/ratings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create rating: ${response.status}`);
    }

    return response.json();
  },

  async getWorkerRatings(workerId: string, filters: RatingFilters = {}): Promise<RatingListResponse> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, worker_id: workerId }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_CONFIG.baseURL}/ratings/worker/${workerId}?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch worker ratings: ${response.status}`);
    }

    return response.json();
  },

  async getClientRatings(filters: RatingFilters = {}): Promise<RatingListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_CONFIG.baseURL}/ratings/my-ratings?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch ratings: ${response.status}`);
    }

    return response.json();
  },

  async updateRating(ratingId: string, data: Partial<CreateRatingData>): Promise<Rating> {
    const response = await fetch(`${API_CONFIG.baseURL}/ratings/${ratingId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update rating: ${response.status}`);
    }

    return response.json();
  },

  async deleteRating(ratingId: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.baseURL}/ratings/${ratingId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete rating: ${response.status}`);
    }
  }
};

export const useCreateRating = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRating = useCallback(async (data: CreateRatingData): Promise<Rating> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ratingsApi.createRating(data);
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
    createRating,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export const useClientRatings = (filters: RatingFilters = {}) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ratingsApi.getClientRatings(filters);
      setRatings(response.ratings);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setRatings([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return {
    ratings,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchRatings
  };
};

export const useRatingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRating = useCallback(async (ratingId: string, data: Partial<CreateRatingData>): Promise<Rating> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ratingsApi.updateRating(ratingId, data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRating = useCallback(async (ratingId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await ratingsApi.deleteRating(ratingId);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateRating,
    deleteRating,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

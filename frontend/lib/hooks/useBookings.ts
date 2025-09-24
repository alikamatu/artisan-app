"use client";

import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';
import { 
  Booking, 
  BookingListResponse, 
  CreateBookingData, 
  UpdateBookingData,
  BookingFilters,
  CompletionProof
} from '../types/booking';

const bookingsApi = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await fetch(`${API_CONFIG.baseURL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create booking: ${response.status}`);
    }

    return response.json();
  },

  async getMyBookings(filters: BookingFilters = {}): Promise<BookingListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}/bookings/my-bookings?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch bookings: ${response.status}`);
    }

    return response.json();
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await fetch(`${API_CONFIG.baseURL}/bookings/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch booking: ${response.status}`);
    }

    return response.json();
  },

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const response = await fetch(`${API_CONFIG.baseURL}/bookings/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update booking: ${response.status}`);
    }

    return response.json();
  },

  async markAsCompleted(id: string, completionProof?: CompletionProof[]): Promise<Booking> {
    const response = await fetch(`${API_CONFIG.baseURL}/bookings/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completion_proof: completionProof })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to mark booking as completed: ${response.status}`);
    }

    return response.json();
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const response = await fetch(`${API_CONFIG.baseURL}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to cancel booking: ${response.status}`);
    }

    return response.json();
  }
};

export const useCreateBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(async (data: CreateBookingData): Promise<Booking> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.createBooking(data);
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
    createBooking,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export const useBookings = (filters: BookingFilters = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.getMyBookings(filters);
      setBookings(response.bookings);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setBookings([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchBookings
  };
};

export const useBooking = (id: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.getBooking(id);
      setBooking(response);
    } catch (err) {
      setError(handleApiError(err));
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return {
    booking,
    isLoading,
    error,
    refetch: fetchBooking
  };
};

export const useBookingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBooking = useCallback(async (id: string, data: UpdateBookingData): Promise<Booking> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.updateBooking(id, data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsCompleted = useCallback(async (id: string, completionProof?: CompletionProof[]): Promise<Booking> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.markAsCompleted(id, completionProof);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id: string, reason?: string): Promise<Booking> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookingsApi.cancelBooking(id, reason);
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
    updateBooking,
    markAsCompleted,
    cancelBooking,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export { bookingsApi };
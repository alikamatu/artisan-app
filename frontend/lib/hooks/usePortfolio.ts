import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';

export interface PortfolioItem {
  id: string;
  worker_id: string;
  title: string;
  description: string;
  category: string;
  type: 'image' | 'video' | 'document' | 'link';
  media_urls: string[];
  tags: string[];
  project_date: string;
  location: string;
  project_budget: number;
  duration: string;
  client_name: string;
  is_published: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  worker?: {
    id: string;
    name: string;
    display_name?: string;
    profile_photo?: string;
  };
}

export interface CreatePortfolioData {
  title: string;
  description?: string;
  category: string;
  type: 'image' | 'video' | 'document' | 'link';
  media_urls?: string[];
  tags?: string[];
  project_date?: string;
  location?: string;
  project_budget?: number;
  duration?: string;
  client_name?: string;
  is_published?: boolean;
  challenges?: string[];
  solutions?: string[];
}

export interface PortfolioFilters {
  page?: number;
  limit?: number;
  worker_id?: string;
  category?: string;
  search?: string;
  is_published?: boolean;
  sort_by?: 'created_at' | 'views_count' | 'likes_count' | 'project_date';
  sort_order?: 'ASC' | 'DESC';
}

export interface PortfolioListResponse {
  items: PortfolioItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: { category: string; count: number }[];
}

const portfolioApi = {
  async createPortfolio(data: CreatePortfolioData): Promise<PortfolioItem> {
    const response = await fetch(`${API_CONFIG.baseURL}/portfolio`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create portfolio item: ${response.status}`);
    }

    return response.json();
  },

  async getPortfolio(filters: PortfolioFilters = {}): Promise<PortfolioListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_CONFIG.baseURL}/portfolio?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch portfolio: ${response.status}`);
    }

    return response.json();
  },

  async getPortfolioItem(id: string): Promise<PortfolioItem> {
    const response = await fetch(`${API_CONFIG.baseURL}/portfolio/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch portfolio item: ${response.status}`);
    }

    return response.json();
  },

  async updatePortfolio(id: string, data: Partial<CreatePortfolioData>): Promise<PortfolioItem> {
    const response = await fetch(`${API_CONFIG.baseURL}/portfolio/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update portfolio item: ${response.status}`);
    }

    return response.json();
  },

  async deletePortfolio(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_CONFIG.baseURL}/portfolio/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete portfolio item: ${response.status}`);
    }

    return response.json();
  },

  async likePortfolio(id: string): Promise<{ likes_count: number; has_liked: boolean }> {
    const response = await fetch(`${API_CONFIG.baseURL}/portfolio/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to like portfolio item: ${response.status}`);
    }

    return response.json();
  },

  async uploadMedia(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_CONFIG.baseURL}/portfolio/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload media: ${response.status}`);
    }

    return response.json();
  }
};

export const usePortfolio = (filters: PortfolioFilters = {}) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.getPortfolio(filters);
      setItems(response.items);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
      setCategories(response.categories);
    } catch (err) {
      setError(handleApiError(err));
      setItems([]);
      setTotal(0);
      setTotalPages(0);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    categories,
    isLoading,
    error,
    refetch: fetchPortfolio
  };
};

export const usePortfolioActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPortfolio = useCallback(async (data: CreatePortfolioData): Promise<PortfolioItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.createPortfolio(data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePortfolio = useCallback(async (id: string, data: Partial<CreatePortfolioData>): Promise<PortfolioItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.updatePortfolio(id, data);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePortfolio = useCallback(async (id: string): Promise<{ message: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.deletePortfolio(id);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const likePortfolio = useCallback(async (id: string): Promise<{ likes_count: number; has_liked: boolean }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.likePortfolio(id);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadMedia = useCallback(async (file: File): Promise<{ url: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.uploadMedia(file);
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
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    likePortfolio,
    uploadMedia,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export { portfolioApi };
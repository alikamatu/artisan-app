import { useState, useEffect } from 'react';
import { PortfolioItem, PortfolioFilters, PortfolioListResponse, CreatePortfolioDto, UpdatePortfolioDto } from '@/lib/types/portfolio';
import { PortfolioApi } from '@/lib/api/portfolio';

export const usePortfolio = (filters: PortfolioFilters = {}) => {
  const [data, setData] = useState<PortfolioListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    categories: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async (filters: PortfolioFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await PortfolioApi.getPortfolioItems(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(filters);
  }, [filters.worker_id, filters.category, filters.search, filters.page, filters.limit]);

  const refetch = () => fetchPortfolio(filters);

  // Update individual item after like/unlike
  const updateItem = (itemId: string, updates: Partial<PortfolioItem>) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  return {
    items: data.items,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    categories: data.categories,
    isLoading,
    error,
    refetch,
    updateItem
  };
};

export const usePortfolioActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPortfolio = async (data: CreatePortfolioDto): Promise<PortfolioItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PortfolioApi.createPortfolio(data);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create portfolio item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePortfolio = async (id: string, data: UpdatePortfolioDto): Promise<PortfolioItem> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PortfolioApi.updatePortfolioItem(id, data);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update portfolio item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePortfolio = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await PortfolioApi.deletePortfolioItem(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete portfolio item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const likePortfolio = async (id: string): Promise<{ likes_count: number; has_liked: boolean }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PortfolioApi.likePortfolioItem(id);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to like portfolio item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PortfolioApi.uploadMedia(file);
      return result.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload media';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    likePortfolio,
    uploadMedia,
    isLoading,
    error
  };
};
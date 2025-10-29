import { PortfolioItem, CreatePortfolioDto, UpdatePortfolioDto, PortfolioFilters, PortfolioListResponse } from '../types/portfolio';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class PortfolioApi {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async createPortfolio(data: CreatePortfolioDto): Promise<PortfolioItem> {
    return this.request('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getPortfolioItems(filters: PortfolioFilters = {}): Promise<PortfolioListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request(`/portfolio?${params.toString()}`);
  }

  static async getPortfolioItem(id: string): Promise<PortfolioItem> {
    return this.request(`/portfolio/${id}`);
  }

  static async updatePortfolioItem(id: string, data: UpdatePortfolioDto): Promise<PortfolioItem> {
    return this.request(`/portfolio/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deletePortfolioItem(id: string): Promise<{ message: string }> {
    return this.request(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  static async likePortfolioItem(id: string): Promise<{ likes_count: number; has_liked: boolean }> {
    return this.request(`/portfolio/${id}/like`, {
      method: 'POST',
    });
  }

  static async uploadMedia(file: File): Promise<{ url: string }> {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/portfolio/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  static async getWorkerPortfolio(workerId: string, filters: PortfolioFilters = {}): Promise<PortfolioListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request(`/portfolio/worker/${workerId}?${params.toString()}`);
  }
}
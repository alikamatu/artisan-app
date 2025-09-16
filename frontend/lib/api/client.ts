// lib/api/client.ts
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`File upload failed: ${endpoint}`, error);
      throw error;
    }
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
);

// Onboarding API methods
export const onboardingApi = {
  // Get onboarding status
  getStatus: () => apiClient.get('/onboarding/status'),

  // Update onboarding step
  updateStep: (data: { role: string; step: string; data: any }) =>
    apiClient.put('/onboarding/step', data),

  // Complete onboarding
  complete: (data: any) => apiClient.post('/onboarding/complete', data),

  // Upload file
  uploadFile: (file: File) => apiClient.uploadFile('/onboarding/upload', file),

  // Client specific endpoints
  client: {
    updateProfile: (data: any) => apiClient.put('/onboarding/client/profile', data),
    updatePayment: (data: any) => apiClient.put('/onboarding/client/payment', data),
    updatePreferences: (data: any) => apiClient.put('/onboarding/client/preferences', data),
  },

  // Worker specific endpoints
  worker: {
    updateBasic: (data: any) => apiClient.put('/onboarding/worker/basic', data),
    updateProfessional: (data: any) => apiClient.put('/onboarding/worker/professional', data),
    updatePricing: (data: any) => apiClient.put('/onboarding/worker/pricing', data),
    updateVerification: (data: any) => apiClient.put('/onboarding/worker/verification', data),
    updateFinancial: (data: any) => apiClient.put('/onboarding/worker/financial', data),
  },
};

// Auth API methods
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', userData),
  
  logout: () => apiClient.post('/auth/logout'),
  
  refreshToken: () => apiClient.post('/auth/refresh'),
  
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) => apiClient.post('/auth/verify-email', { token }),
  
  resendVerification: (email: string) =>
    apiClient.post('/auth/resend-verification', { email }),
};

// Export the API client for direct use if needed
export default apiClient;
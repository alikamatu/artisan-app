"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  JobApplication, 
  ApplicationListResponse, 
  CreateApplicationData, 
  ApplicationFilters,
  ApplicationStatus
} from '@/lib/types/applications';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';
import { debugFetch } from '@/utils/api-debug';

// API functions
const applicationsApi = {
  // Apply to a job
  async createApplication(data: CreateApplicationData): Promise<JobApplication> {
    const response = await debugFetch(`${API_CONFIG.baseURL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to apply to job: ${response.status}`);
    }

    return response.json();
  },

  // Check if user has already applied to a job
  async checkApplicationExists(jobId: string): Promise<{ hasApplied: boolean; applicationId?: string; status?: ApplicationStatus }> {
    const response = await fetch(`${API_CONFIG.baseURL}/applications/check/${jobId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to check application status: ${response.status}`);
    }

    return response.json();
  },

    async getClientApplications(filters: ApplicationFilters = {}): Promise<ApplicationListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}/applications/clients/my-jobs?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch client applications: ${response.status}`);
    }

    return response.json();
  },

  // Get worker's applications
  async getMyApplications(filters: ApplicationFilters = {}): Promise<ApplicationListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}/applications/my-applications?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch applications: ${response.status}`);
    }

    return response.json();
  },

  // Get applications for a job (client only)
  async getJobApplications(jobId: string, filters: ApplicationFilters = {}): Promise<ApplicationListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}/applications/job/${jobId}?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch job applications: ${response.status}`);
    }

    return response.json();
  },

  // Withdraw application
  async withdrawApplication(applicationId: string): Promise<JobApplication> {
    const response = await fetch(`${API_CONFIG.baseURL}/applications/${applicationId}/withdraw`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to withdraw application: ${response.status}`);
    }

    return response.json();
  },

  // Accept application (client only)
  async acceptApplication(applicationId: string): Promise<JobApplication> {
    const response = await fetch(`${API_CONFIG.baseURL}/applications/${applicationId}/accept`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to accept application: ${response.status}`);
    }

    return response.json();
  },

  // Reject application (client only)
  async rejectApplication(applicationId: string, reason?: string): Promise<JobApplication> {
    const response = await fetch(`${API_CONFIG.baseURL}/applications/${applicationId}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to reject application: ${response.status}`);
    }

    return response.json();
  },

  // Get single application
  async getApplication(applicationId: string): Promise<JobApplication> {
    const response = await fetch(`${API_CONFIG.baseURL}/applications/${applicationId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch application: ${response.status}`);
    }

    return response.json();
  }
};

// Hook for creating job applications
export const useCreateApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApplication = useCallback(async (data: CreateApplicationData): Promise<JobApplication> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.createApplication(data);
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
    createApplication,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for checking application status
export const useApplicationStatus = (jobId: string) => {
  const [applicationStatus, setApplicationStatus] = useState<{
    hasApplied: boolean;
    applicationId?: string;
    status?: ApplicationStatus;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.checkApplicationExists(jobId);
      setApplicationStatus(response);
    } catch (err) {
      setError(handleApiError(err));
      setApplicationStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    applicationStatus,
    isLoading,
    error,
    refetch: checkStatus
  };
};

// Add this debug version to your useApplications.ts file to replace the existing useClientApplications hook

export const useClientApplications = (filters: ApplicationFilters = {}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientApplications = useCallback(async () => {
    console.log('🔍 Fetching client applications with filters:', filters);
    setIsLoading(true);
    setError(null);
    
    try {
      // Debug log the URL and headers
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

      const url = `${API_CONFIG.baseURL}/applications/clients/my-jobs?${params}`;
      const headers = getAuthHeaders();
      
      console.log('🌐 Making request to:', url);
      console.log('📋 Headers:', headers);
      console.log('🔍 Query params:', params.toString());

      const response = await fetch(url, {
        headers: headers
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error response data:', errorData);
        throw new Error(errorData.message || `Failed to fetch client applications: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setLimit(data.limit || 10);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('💥 Fetch error:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setApplications([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchClientApplications();
  }, [fetchClientApplications]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchClientApplications
  };
};

export const useMyApplications = (filters: ApplicationFilters = {}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.getMyApplications(filters);
      setApplications(response.applications);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setApplications([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchApplications
  };
};

// Hook for fetching job applications (client's view)
export const useJobApplications = (jobId: string, filters: ApplicationFilters = {}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobApplications = useCallback(async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.getJobApplications(jobId, filters);
      setApplications(response.applications);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setApplications([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchJobApplications();
  }, [fetchJobApplications]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchJobApplications
  };
};

// Hook for application actions (withdraw, accept, reject)
export const useApplicationActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdrawApplication = useCallback(async (applicationId: string): Promise<JobApplication> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.withdrawApplication(applicationId);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptApplication = useCallback(async (applicationId: string): Promise<JobApplication> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.acceptApplication(applicationId);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectApplication = useCallback(async (applicationId: string, reason?: string): Promise<JobApplication> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.rejectApplication(applicationId, reason);
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
    withdrawApplication,
    acceptApplication,
    rejectApplication,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for single application
export const useApplication = (applicationId: string) => {
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await applicationsApi.getApplication(applicationId);
      setApplication(response);
    } catch (err) {
      setError(handleApiError(err));
      setApplication(null);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  return {
    application,
    isLoading,
    error,
    refetch: fetchApplication
  };
};

// Export the API functions for direct use if needed
export { applicationsApi };
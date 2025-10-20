"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  JobResponse, 
  JobListResponse, 
  CreateJobData, 
  UpdateJobData, 
  JobFilters,
  UseJobsResult,
  UseJobResult,
  UseCreateJobResult,
  UseUpdateJobResult,
  UseDeleteJobResult
} from '@/lib/types/jobs';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';
import { debugFetch } from '@/utils/api-debug';

// API functions
const jobsApi = {
  // Get all jobs with filters
  async getJobs(filters: JobFilters = {}): Promise<JobListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch jobs: ${response.status}`);
    }

    return response.json();
  },

  // Get single job
  async getJob(id: string): Promise<JobResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch job: ${response.status}`);
    }

    return response.json();
  },

async createJob(data: CreateJobData): Promise<JobResponse> {
  const response = await debugFetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create job: ${response.status}`);
  }

  return response.json();
},

  // Update job
  async updateJob(id: string, data: UpdateJobData): Promise<JobResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update job: ${response.status}`);
    }

    return response.json();
  },

  // Add this to your jobsApi object in useJob.ts
async getJobsByClient(clientId: string, filters: JobFilters = {}): Promise<JobListResponse> {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && key !== 'client_id') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}?${params}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch client jobs: ${response.status}`);
  }

  return response.json();
},

  // Delete job
  async deleteJob(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete job: ${response.status}`);
    }

    return response.json();
  },

  // Get client's jobs
  async getMyJobs(filters: JobFilters = {}): Promise<JobListResponse> {
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

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.jobs}/client/my-jobs?${params}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch your jobs: ${response.status}`);
    }

    return response.json();
  }
};



// Hook for fetching multiple jobs
export const useJobs = (filters: JobFilters = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.getJobs(filters);
      setJobs(response.jobs);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setJobs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchJobs
  };
};

// Hook for fetching jobs by client ID (for public profiles)
export const useClientJobs = (clientId: string, filters: JobFilters = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientJobs = useCallback(async () => {
    if (!clientId) {
      setJobs([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.getJobsByClient(clientId, filters);
      setJobs(response.jobs);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setJobs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchClientJobs();
  }, [fetchClientJobs]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchClientJobs
  };
};

// Hook for fetching a single job
export const useJob = (id: string): UseJobResult => {
  const [job, setJob] = useState<JobResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.getJob(id);
      setJob(response);
    } catch (err) {
      setError(handleApiError(err));
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    isLoading,
    error,
    refetch: fetchJob
  };
};

// Hook for creating jobs
export const useCreateJob = (): UseCreateJobResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = useCallback(async (data: CreateJobData): Promise<JobResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.createJob(data);
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
    createJob,
    isLoading,
    error
  };
};

// Hook for updating jobs
export const useUpdateJob = (): UseUpdateJobResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJob = useCallback(async (id: string, data: UpdateJobData): Promise<JobResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.updateJob(id, data);
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
    updateJob,
    isLoading,
    error
  };
};

// Hook for deleting jobs
export const useDeleteJob = (): UseDeleteJobResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJob = useCallback(async (id: string): Promise<{ message: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.deleteJob(id);
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
    deleteJob,
    isLoading,
    error
  };
};

// Hook for fetching client's jobs
export const useMyJobs = (filters: JobFilters = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await jobsApi.getMyJobs(filters);
      setJobs(response.jobs);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
      setJobs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchMyJobs
  };
};

// Export the API functions for direct use if needed
export { jobsApi };
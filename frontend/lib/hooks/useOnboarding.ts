"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

export interface OnboardingStatus {
  completed: boolean;
  role: 'client' | 'worker' | null;
  progress: Record<string, boolean>;
  nextStep: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const useOnboarding = () => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  // Improved token retrieval with better error handling
  const getValidToken = async (): Promise<string | null> => {
    try {
      // Try localStorage first
      let token = localStorage.getItem('access_token');
      
      // If no token in localStorage, try sessionStorage
      if (!token) {
        token = sessionStorage.getItem('access_token');
      }
      
      if (!token) {
        console.log('No token found in storage');
        return null;
      }

      // Basic JWT format validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid JWT format');
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        return null;
      }

      // Check if token is expired (basic check)
      try {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          console.log('Token is expired');
          localStorage.removeItem('access_token');
          sessionStorage.removeItem('access_token');
          return null;
        }
      } catch (e) {
        console.log('Could not decode token payload');
        return token; // Return token anyway, let server validate
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const apiCall = async <T = any>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const token = await getValidToken();
      
      if (!token) {
        throw new Error('No valid authentication token found. Please log in again.');
      }

      // Calculate payload size for logging
      const payloadSize = data ? JSON.stringify(data).length : 0;
      console.log(`Request payload size: ${formatFileSize(payloadSize)}`);

      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      console.log('Making request to:', `${process.env.NEXT_PUBLIC_API_URL}/onboarding${endpoint}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding${endpoint}`, config);
      
      console.log('Response status:', response.status);

      // Handle different error status codes
      if (response.status === 401) {
        console.log('Unauthorized - clearing tokens and redirecting to login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        
        throw new Error('Session expired. Please log in again.');
      }

      if (response.status === 413) {
        throw new Error('The data you\'re trying to send is too large. Please try compressing your images or reducing the amount of data.');
      }

      if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid data format. Please check your input.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (err: any) {
      console.error('API Error:', err);
      
      // If it's an authentication error, trigger logout
      if (err.message.includes('Session expired') || err.message.includes('authentication token')) {
        setTimeout(() => logout(), 100); // Small delay to avoid state conflicts
      }
      
      return { 
        success: false, 
        error: err.message || 'An unexpected error occurred' 
      };
    }
  };

  // Fetch onboarding status
  const fetchStatus = useCallback(async () => {
    console.log('fetchStatus called');
    
    // Check if user exists
    if (!user) {
      console.log('No user found, skipping fetch');
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall<OnboardingStatus>('/status');
      
      if (response.success && response.data) {
        setStatus(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch onboarding status');
      }
    } catch (err: any) {
      console.error('fetchStatus error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

  const updateStep = useCallback(async (
    role: 'client' | 'worker',
    step: string,
    data: any
  ): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      let endpoint: string;
      
      if (role === 'client') {
        switch (step) {
          case 'profile': endpoint = '/client/profile'; break;
          case 'payment': endpoint = '/client/payment'; break;
          case 'preferences': endpoint = '/client/preferences'; break;
          default: endpoint = '/step';
        }
      } else {
        switch (step) {
          case 'basic': endpoint = '/worker/basic'; break;
          case 'professional': endpoint = '/worker/professional'; break;
          case 'pricing': endpoint = '/worker/pricing'; break;
          case 'verification': endpoint = '/worker/verification'; break;
          case 'financial': endpoint = '/worker/financial'; break;
          default: endpoint = '/step';
        }
      }

      const response = await apiCall(endpoint, 'PUT', 
        endpoint === '/step' ? { role, step, data } : data
      );

      if (response.success) {
        await fetchStatus();
        return true;
      } else {
        setError(response.error || 'Failed to update step');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [fetchStatus]);

  const completeOnboarding = useCallback(async (data: any): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiCall('/complete', 'POST', data);

      if (response.success) {
        await fetchStatus();
        return true;
      } else {
        setError(response.error || 'Failed to complete onboarding');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [fetchStatus]);

const uploadFile = useCallback(async (file: File): Promise<string | null> => {
  setSubmitting(true);
  setError(null);

  let objectUrl: string | null = null;

  try {
    const token = await getValidToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    let fileToUpload = file;

    // Add more specific image type checking
    if (file.type.startsWith('image/')) {
      console.log(`Original file size: ${formatFileSize(file.size)}, compressing...`);
      
      // Check file size before attempting compression
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('Image is too large. Please use an image smaller than 10MB.');
      }

      try {
        fileToUpload = await compressImage(file, {
          maxWidth: 800, // Reduced from 1200 for better performance
          maxHeight: 800,
          quality: 0.7,  // Slightly lower quality for faster processing
          maxSizeKB: 300 // Reduced from 500
        });
        console.log(`Compressed file size: ${formatFileSize(fileToUpload.size)}`);
      } catch (compressionError: any) {
        console.warn('Image compression failed:', compressionError);
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Image is too large. Please use an image smaller than 2MB.');
        }
      }
    }

      // Additional size check
if (fileToUpload.size > 5 * 1024 * 1024) {
      throw new Error('File is too large. Maximum file size is 5MB.');
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    console.log(`Uploading file: ${fileToUpload.name} (${formatFileSize(fileToUpload.size)})`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }

      if (response.status === 413) {
        throw new Error('File is too large for upload. Please try a smaller image.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      console.log('Upload successful:', result.url);
      return result.url;
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message);
      if (err.message.includes('Session expired')) {
        setTimeout(() => logout(), 100);
      }
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [logout]);

  return {
    status,
    loading,
    submitting,
    error,
    fetchStatus,
    updateStep,
    completeOnboarding,
    uploadFile,
    clearError: () => setError(null),
  };
};
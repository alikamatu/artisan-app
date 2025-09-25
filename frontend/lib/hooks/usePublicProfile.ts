"use client";

import { useState, useEffect } from 'react';
import { API_CONFIG, getAuthHeaders, handleApiError } from '@/config/api.config';

interface PublicProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  region?: string;
  isVerified: boolean;
  verificationLevel: number;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  bio?: string;
  profilePhoto?: string;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;
  skills?: string[];
  services?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  hourlyRate?: number;
  serviceArea?: string;
  maxDistance?: number;
  company?: string;
  totalJobsPosted?: number;
  averageRating?: number;
  description?: string;
}

export const usePublicProfile = (userId: string) => {
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.baseURL}/auth/user/${userId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching public profile:', err);
      setError(handleApiError(err));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
};
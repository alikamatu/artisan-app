"use client";

import { useState, useEffect } from 'react';

interface ProfileData {
  photo?: string;
  address?: string;
  lastName?: string;
  firstName?: string;
  profilePhoto: string;
  businessName?: string;
}

interface ProfessionalData {
  skills?: string[];
  services?: string[];
  education?: string;
  experience?: string;
  description?: string;
  certifications?: string[];
}

interface PricingData {
  hourly_rate?: number;
  max_distance?: number;
  service_area?: string;
  working_hours?: {
    end: string;
    start: string;
  };
  available_days?: string[];
}

interface FinancialData {
  bank_name?: string | null;
  account_name?: string;
  account_type?: string;
  account_number?: string;
  routing_number?: string | null;
  mobile_money_provider?: string;
}

interface VerificationData {
  id_type?: string;
  id_document?: string;
  verification_status?: string;
  background_check_consent?: boolean;
}

interface OnboardingProgress {
  basic?: boolean;
  pricing?: boolean;
  financial?: boolean;
  professional?: boolean;
  verification?: boolean;
}

interface UserProfileData {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role: 'client' | 'worker';
  region?: string;
  profilePhoto?: string;
  targetProfile?: string;
  isVerified?: boolean;
  verificationLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;
  company?: string;
  totalJobsPosted?: number;
  averageRating?: number;
  
  // Raw metadata from backend
  metadata?: {
    profile?: ProfileData;
    professional?: ProfessionalData;
    pricing?: PricingData;
    financial?: FinancialData;
    verification?: VerificationData;
    onboarding_progress?: OnboardingProgress;
  };
  
  // Flattened data for easier access
  profile?: ProfileData;
  professional?: ProfessionalData;
  pricing?: PricingData;
  financial?: FinancialData;
  verification?: VerificationData;
  onboarding_progress?: OnboardingProgress;
}

interface UseUserProfileReturn {
  profile: UserProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOnboardingComplete: boolean;
  onboardingSteps: {
    basic: boolean;
    pricing: boolean;
    financial: boolean;
    professional: boolean;
    verification: boolean;
  };
}

// Helper function to safely extract nested metadata
const extractMetadataFields = (rawProfile: any): UserProfileData => {
  const metadata = rawProfile.metadata || {};
  
  return {
    ...rawProfile,
    // Keep original metadata
    metadata: metadata,
    // Flatten for easier component access
    profile: metadata.profile || {},
    professional: metadata.professional || {},
    pricing: metadata.pricing || {},
    financial: metadata.financial || {},
    verification: metadata.verification || {},
    onboarding_progress: metadata.onboarding_progress || {},
  };
};

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const extractedData = extractMetadataFields(rawData);
      setProfile(extractedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      // Prepare update payload - handle both flat and nested updates
      const updatePayload: any = {};
      
      // Direct user fields
      if (data.name) updatePayload.name = data.name;
      if (data.phone) updatePayload.phone = data.phone;
      if (data.region) updatePayload.region = data.region;
      if (data.bio) updatePayload.bio = data.bio;
      if (data.company) updatePayload.company = data.company;
      
      // Nested metadata fields
      if (data.profile) updatePayload.profile = data.profile;
      if (data.professional) updatePayload.professional = data.professional;
      if (data.pricing) updatePayload.pricing = data.pricing;
      if (data.financial) updatePayload.financial = data.financial;
      if (data.verification) updatePayload.verification = data.verification;
      if (data.onboarding_progress) updatePayload.onboarding_progress = data.onboarding_progress;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawUpdatedProfile = await response.json();
      const extractedProfile = extractMetadataFields(rawUpdatedProfile);
      setProfile(extractedProfile);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  // Calculate onboarding completion
  const isOnboardingComplete = profile?.onboarding_progress ? 
    Object.values(profile.onboarding_progress).every(step => step === true) : false;
  
  const onboardingSteps = {
    basic: profile?.onboarding_progress?.basic || false,
    pricing: profile?.onboarding_progress?.pricing || false,
    financial: profile?.onboarding_progress?.financial || false,
    professional: profile?.onboarding_progress?.professional || false,
    verification: profile?.onboarding_progress?.verification || false,
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
    isOnboardingComplete,
    onboardingSteps,
  };
};
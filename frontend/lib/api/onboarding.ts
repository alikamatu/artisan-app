import { apiClient } from './client';

export interface OnboardingStatus {
  completed: boolean;
  role: 'client' | 'worker' | null;
  progress: Record<string, boolean>;
  nextStep: string;
}

export interface OnboardingStepData {
  role: 'client' | 'worker';
  step: string;
  data: any;
}

export interface CompleteOnboardingData {
  role: 'client' | 'worker';
  profile: any;
  payment?: any;
  preferences?: any;
  professional?: any;
  pricing?: any;
  verification?: any;
  financial?: any;
}

// Base API functions
export const onboardingApi = {
  // Get current onboarding status
  getStatus: async (): Promise<OnboardingStatus> => {
    const response = await apiClient.get('/status');
    return response.data;
  },

  // Update a specific step
  updateStep: async (stepData: OnboardingStepData) => {
    const response = await apiClient.put('/onboarding/step', stepData);
    return response.data;
  },

  // Complete entire onboarding
  complete: async (data: CompleteOnboardingData) => {
    const response = await apiClient.post('/onboarding/complete', data);
    return response.data;
  },

  // Upload file (photo, document)
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/onboarding/upload', formData);
    return response.data;
  },

  // Client specific endpoints
  client: {
    updateProfile: async (profileData: any) => {
      const response = await apiClient.put('/onboarding/client/profile', profileData);
      return response.data;
    },
    
    updatePayment: async (paymentData: any) => {
      const response = await apiClient.put('/onboarding/client/payment', paymentData);
      return response.data;
    },
    
    updatePreferences: async (preferencesData: any) => {
      const response = await apiClient.put('/onboarding/client/preferences', preferencesData);
      return response.data;
    },
  },

  // Worker specific endpoints
  worker: {
    updateBasic: async (basicData: any) => {
      const response = await apiClient.put('/onboarding/worker/basic', basicData);
      return response.data;
    },
    
    updateProfessional: async (professionalData: any) => {
      const response = await apiClient.put('/onboarding/worker/professional', professionalData);
      return response.data;
    },
    
    updatePricing: async (pricingData: any) => {
      const response = await apiClient.put('/onboarding/worker/pricing', pricingData);
      return response.data;
    },
    
    updateVerification: async (verificationData: any) => {
      const response = await apiClient.put('/onboarding/worker/verification', verificationData);
      return response.data;
    },
    
    updateFinancial: async (financialData: any) => {
      const response = await apiClient.put('/onboarding/worker/financial', financialData);
      return response.data;
    },
  },
};
export type UserRole = 'client' | 'worker';

export interface CommonProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string | null;
}

export interface Location {
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

// Client-specific types
export interface ClientProfile extends CommonProfile {
  location: Location;
}

export interface PaymentMethod {
  method: 'card' | 'paypal';
  card?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  paypalEmail?: string;
}

export interface ClientPreferences {
  serviceCategories: string[];
  budgetRange: [number, number]; // [min, max]
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Worker-specific types
export interface WorkerProfile extends CommonProfile {
  businessName: string;
  locations: Location[];
}

export interface ProfessionalInfo {
  skills: string[];
  yearsExperience: string;
  certifications: string[];
  description: string;
}

export interface PricingAvailability {
  hourlyRate: number;
  projectRate: number;
  availability: string[]; // Days of week
  travelFee: boolean;
  travelFeeAmount?: number;
  unavailableDates: Date[];
}

export interface VerificationDocuments {
  documentType: 'driver' | 'id' | 'passport';
  frontImage: File | string;
  backImage?: File | string; // Optional for some document types
  selfieImage: File | string;
}

export interface PayoutMethod {
  method: 'bank' | 'paypal' | 'venmo' | 'cashapp';
  bank?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  paypalEmail?: string;
  venmoHandle?: string;
  cashappHandle?: string;
}

// Main onboarding data structure
export type OnboardingData = {
  role: UserRole;
} & (
  | {
      role: 'client';
      profile: ClientProfile;
      payment: PaymentMethod;
      preferences: ClientPreferences;
    }
  | {
      role: 'worker';
      profile: WorkerProfile;
      professional: ProfessionalInfo;
      pricing: PricingAvailability;
      verification: VerificationDocuments;
      payout: PayoutMethod;
    }
);

// Step-specific types for form handling
export type RoleSelectionData = {
  role: UserRole;
};

export type ClientProfileData = ClientProfile;
export type ClientPaymentData = PaymentMethod;
export type ClientPreferencesData = ClientPreferences;

export type WorkerBasicInfoData = WorkerProfile;
export type WorkerProfessionalInfoData = ProfessionalInfo;
export type WorkerPricingAvailabilityData = PricingAvailability;
export type WorkerVerificationData = VerificationDocuments;
export type WorkerFinancialData = PayoutMethod;

// API response types
export interface OnboardingSuccessResponse {
  success: true;
  userId: string;
  role: UserRole;
  nextStep?: string;
}

export interface OnboardingErrorResponse {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type OnboardingResponse = OnboardingSuccessResponse | OnboardingErrorResponse;
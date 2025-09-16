export interface BaseUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'client' | 'worker';
  region?: string;
  is_verified?: boolean;
  verificationLevel: number;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
  bio?: string;
}

export interface WorkerProfile {
  id: string;
  businessName: string;
  services: string[];
  experience: string;
  description: string;
  skills: string[];
  certifications?: string[];
  education?: string;
  hourlyRate: number;
  availableDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  serviceArea: string;
  maxDistance: number;
  portfolioImages?: string[];
  rating?: number;
  bio?: string;
  completedJobs?: number;
  totalJobs?: number;
}

export interface ClientProfile {
  id: string;
  company?: string;
  bio?: string;
  categories: string[];
  budgetRange: [number, number];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  totalJobsPosted?: number;
  averageRating?: number;
}
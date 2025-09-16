import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserRole } from '../entities/user.entity';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  verificationLevel: number;
  createdAt: string;
  metadata: any;
}

export interface ClientProfile extends UserProfile {
  profile?: {
    firstName: string;
    lastName: string;
    company?: string;
    bio?: string;
    address: string;
    photo?: string;
  };
  paymentMethods?: any;
  preferences?: any;
}

export interface WorkerProfile extends UserProfile {
  businessName?: string;
  description?: string;
  services?: string[];
  hourlyRate?: number;
  availableDays?: string[];
  workingHours?: { start: string; end: string };
  serviceArea?: string;
  maxDistance?: number;
  skills?: string[];
  experienceYears?: number;
  certifications?: string[];
  education?: string;
  verificationStatus?: string;
  profileImage?: string;
  rating?: number;
  totalJobs?: number;
  totalEarnings?: number;
  joinedDate?: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly supabase: SupabaseService) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.is_verified,
      verificationLevel: user.verification_level || 0,
      createdAt: user.created_at,
      metadata: user.metadata || {},
    };
  }

  async getClientProfile(userId: string): Promise<ClientProfile> {
    const baseProfile = await this.getUserProfile(userId);

    if (baseProfile.role !== 'client') {
      throw new BadRequestException('User is not a client');
    }

    const { data: clientProfile, error } = await this.supabase
      .client
      .from('client_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      ...baseProfile,
      profile: baseProfile.metadata?.profile,
      paymentMethods: clientProfile?.payment_methods,
      preferences: baseProfile.metadata?.preferences || clientProfile?.preferences,
    };
  }

  async getWorkerProfile(userId: string): Promise<WorkerProfile> {
    const baseProfile = await this.getUserProfile(userId);

    if (baseProfile.role !== 'worker') {
      throw new BadRequestException('User is not a worker');
    }

    const { data: workerProfile, error } = await this.supabase
      .client
      .from('worker_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get additional stats
    const { data: jobsData } = await this.supabase
      .client
      .from('booking')
      .select('id, total_amount')
      .eq('worker_id', userId)
      .eq('status', 'completed');

    const { data: reviewsData } = await this.supabase
      .client
      .from('review')
      .select('rating')
      .eq('subject_id', userId);

    const totalJobs = jobsData?.length || 0;
    const totalEarnings = jobsData?.reduce((sum, job) => sum + (job.total_amount || 0), 0) || 0;
    const averageRating = reviewsData?.length 
      ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
      : 0;

    return {
      ...baseProfile,
      businessName: workerProfile?.business_name || baseProfile.metadata?.profile?.businessName,
      description: workerProfile?.description || baseProfile.metadata?.professional?.description,
      services: workerProfile?.services || baseProfile.metadata?.professional?.services || [],
      hourlyRate: workerProfile?.hourly_rate || baseProfile.metadata?.pricing?.hourly_rate,
      availableDays: workerProfile?.available_days || baseProfile.metadata?.pricing?.available_days || [],
      workingHours: workerProfile?.working_hours || baseProfile.metadata?.pricing?.working_hours,
      serviceArea: workerProfile?.service_area || baseProfile.metadata?.pricing?.service_area,
      maxDistance: workerProfile?.max_distance || baseProfile.metadata?.pricing?.max_distance,
      skills: workerProfile?.skills || baseProfile.metadata?.professional?.skills || [],
      experienceYears: workerProfile?.experience_years || 0,
      certifications: workerProfile?.certifications || baseProfile.metadata?.professional?.certifications || [],
      education: workerProfile?.education || baseProfile.metadata?.professional?.education,
      verificationStatus: workerProfile?.verification_status || baseProfile.metadata?.verification?.verification_status || 'pending',
      profileImage: workerProfile?.profile_image || baseProfile.metadata?.profile?.photo,
      rating: Math.round(averageRating * 10) / 10,
      totalJobs,
      totalEarnings,
      joinedDate: baseProfile.createdAt,
    };
  }

  async updateUserProfile(userId: string, updateData: Partial<UserProfile>) {
    const { error } = await this.supabase
      .client
      .from('user')
      .update({
        name: updateData.name,
        phone: updateData.phone,
        metadata: updateData.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new BadRequestException(`Failed to update profile: ${error.message}`);
    }

    return { message: 'Profile updated successfully' };
  }
}

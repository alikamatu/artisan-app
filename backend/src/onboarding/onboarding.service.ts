// src/onboarding/onboarding.service.ts - Fixed version
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CompleteOnboardingDto, UpdateOnboardingStepDto, OnboardingRole, WorkerBasicInfoDto } from '../auth/dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly cloudinary: CloudinaryService,
  ) {}

 async getOnboardingStatus(userId: string) {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('role, metadata')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    // Fix: Check if user has a valid role (client or worker)
    const hasValidRole = user.role && (user.role === 'client' || user.role === 'worker');
    const onboardingProgress = user.metadata?.onboarding_progress || {};
    
    // Check if onboarding is marked as complete in metadata
    const markedComplete = user.metadata?.onboarding_completed === true;

    return {
      completed: hasValidRole && (markedComplete || this.isOnboardingComplete(user.role, onboardingProgress)),
      role: user.role,
      progress: onboardingProgress,
      nextStep: this.getNextStep(user.role, onboardingProgress),
    };
  }

  async updateOnboardingStep(userId: string, stepData: UpdateOnboardingStepDto) {
    const { role, step, data } = stepData;

    // Update user role if it's the first step or if user doesn't have a role
    const currentRole = await this.getUserRole(userId);
    if (step === 'role' || !currentRole || currentRole === 'null') {
      await this.updateUserRole(userId, role);
    }

    // Process step data based on role and step
    if (role === OnboardingRole.CLIENT) {
      return await this.updateClientStep(userId, step, data);
    } else if (role === OnboardingRole.WORKER) {
      return await this.updateWorkerStep(userId, step, data);
    }

    throw new BadRequestException('Invalid role or step');
  }

  async completeOnboarding(userId: string, onboardingData: CompleteOnboardingDto) {
    const { role } = onboardingData;

    try {
      // Update user role
      await this.updateUserRole(userId, role);

      if (role === OnboardingRole.CLIENT) {
        await this.completeClientOnboarding(userId, onboardingData);
      } else if (role === OnboardingRole.WORKER) {
        await this.completeWorkerOnboarding(userId, onboardingData);
      }

      // Mark onboarding as complete
      await this.markOnboardingComplete(userId);

      return { message: 'Onboarding completed successfully', role };
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      throw new BadRequestException('Failed to complete onboarding');
    }
  }

  private async updateClientStep(userId: string, step: string, data: any) {
    let updateData: any = {};
    let progressUpdate: any = {};

    switch (step) {
      case 'profile':
        updateData = {
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          metadata: {
            profile: {
              firstName: data.firstName,
              lastName: data.lastName,
              company: data.company,
              bio: data.bio,
              address: data.address,
              photo: data.photo,
            }
          }
        };
        progressUpdate.profile = true;
        break;

      case 'payment':
        const existingMetadata = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...existingMetadata,
            payment: {
              method: data.paymentMethod,
              billing_address: data.billingAddress,
              card_last4: data.cardNumber?.slice(-4),
              cardholder_name: data.cardholderName,
            }
          }
        };
        progressUpdate.payment = true;
        break;

      case 'preferences':
        const metadata = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...metadata,
            preferences: {
              categories: data.categories,
              budget_range: data.budgetRange,
              notifications: data.notifications,
            }
          }
        };
        progressUpdate.preferences = true;
        break;
    }

    // Update progress
    const currentProgress = (await this.getUserMetadata(userId))?.onboarding_progress || {};
    updateData.metadata = {
      ...updateData.metadata,
      onboarding_progress: { ...currentProgress, ...progressUpdate }
    };

    const { error } = await this.supabase
      .client
      .from('user')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      throw new BadRequestException(`Failed to update ${step}: ${error.message}`);
    }

    return { message: `${step} updated successfully` };
  }

  private async updateWorkerStep(userId: string, step: string, data: any) {
    let updateData: any = {};
    let progressUpdate: any = {};

    switch (step) {
      case 'basic':
        updateData = {
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          metadata: {
            profile: {
              firstName: data.firstName,
              lastName: data.lastName,
              businessName: data.businessName,
              address: data.address,
              photo: data.photo,
            }
          }
        };
        progressUpdate.basic = true;
        break;

      case 'professional':
        const existingMetadata = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...existingMetadata,
            professional: {
              services: data.services,
              experience: data.experience,
              description: data.description,
              skills: data.skills,
              certifications: data.certifications,
              education: data.education,
            }
          }
        };
        progressUpdate.professional = true;
        break;

      case 'pricing':
        const metadata = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...metadata,
            pricing: {
              hourly_rate: data.hourlyRate,
              available_days: data.availableDays,
              working_hours: data.workingHours,
              service_area: data.serviceArea,
              max_distance: data.maxDistance,
            }
          }
        };
        progressUpdate.pricing = true;
        break;

      case 'verification':
        const metadataV = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...metadataV,
            verification: {
              id_type: data.idType,
              id_number: data.idNumber,
              id_document: data.idDocument,
              portfolio_images: data.portfolioImages,
              background_check_consent: data.backgroundCheckConsent,
              verification_status: 'pending',
            }
          }
        };
        progressUpdate.verification = true;
        break;

      case 'financial':
        const metadataF = await this.getUserMetadata(userId);
        updateData = {
          metadata: {
            ...metadataF,
            financial: {
              account_type: data.accountType,
              account_number: data.accountNumber,
              account_name: data.accountName,
              bank_name: data.bankName,
              routing_number: data.routingNumber,
              mobile_money_provider: data.mobileMoneyProvider,
            }
          }
        };
        progressUpdate.financial = true;
        break;
    }

    // Update progress
    const currentProgress = (await this.getUserMetadata(userId))?.onboarding_progress || {};
    updateData.metadata = {
      ...updateData.metadata,
      onboarding_progress: { ...currentProgress, ...progressUpdate }
    };

    const { error } = await this.supabase
      .client
      .from('user')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      throw new BadRequestException(`Failed to update ${step}: ${error.message}`);
    }

    return { message: `${step} updated successfully` };
  }

  private async completeClientOnboarding(userId: string, data: CompleteOnboardingDto) {
    const profileData = {
      user_id: userId,
      profile_image: data.profile.photo,
      payment_methods: data.payment ? {
        primary: {
          type: data.payment.paymentMethod,
          last4: data.payment.cardNumber?.slice(-4),
          cardholderName: data.payment.cardholderName,
          expiryDate: data.payment.expiryDate,
        },
        billing_address: data.payment.billingAddress,
      } : null,
      preferences: data.preferences,
      address_details: this.parseAddress(data.profile.address),
      onboarding_completed: true,
      onboarding_progress: {
        profile: true,
        payment: !!data.payment,
        preferences: !!data.preferences,
      }
    };

    const { error } = await this.supabase
      .client
      .from('client_profile')
      .upsert(profileData);

    if (error) {
      throw new BadRequestException(`Failed to create client profile: ${error.message}`);
    }
  }
private async completeWorkerOnboarding(userId: string, data: CompleteOnboardingDto) {
  const profile = data.profile || {} as WorkerBasicInfoDto;

  const workerProfileData = {
    user_id: userId,
    business_name: 'businessName' in profile ? profile.businessName : '',
    description: data.professional?.description,
    services: data.professional?.services || [],
    hourly_rate: data.pricing?.hourlyRate,
    available_days: data.pricing?.availableDays || [],
    working_hours: data.pricing?.workingHours,
    service_area: data.pricing?.serviceArea,
    max_distance: data.pricing?.maxDistance,
    skills: data.professional?.skills || [],
    experience_years: this.parseExperience(data.professional?.experience),
    certifications: data.professional?.certifications || [],
    education: data.professional?.education,
    verification_status: 'pending',
    profile_image: profile.photo,
    onboarding_completed: true,
  };
}

  // Helper methods
  private async updateUserRole(userId: string, role: OnboardingRole) {
    const { error } = await this.supabase
      .client
      .from('user')
      .update({ role })
      .eq('id', userId);

    if (error) {
      throw new BadRequestException(`Failed to update user role: ${error.message}`);
    }
  }

  private async getUserRole(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .client
      .from('user')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role || null;
  }

  private async getUserMetadata(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .client
      .from('user')
      .select('metadata')
      .eq('id', userId)
      .single();

    return data?.metadata || {};
  }

  private async markOnboardingComplete(userId: string) {
    const metadata = await this.getUserMetadata(userId);
    const { error } = await this.supabase
      .client
      .from('user')
      .update({
        metadata: {
          ...metadata,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        }
      })
      .eq('id', userId);

    if (error) {
      throw new BadRequestException('Failed to mark onboarding as complete');
    }
  }

  private isOnboardingComplete(role: string, progress: any): boolean {
    if (!role) return false;
    
    if (role === 'client') {
      return progress.profile && progress.payment && progress.preferences;
    } else if (role === 'worker') {
      return progress.basic && progress.professional && progress.pricing && 
             progress.verification && progress.financial;
    }
    return false;
  }

  private getNextStep(role: string, progress: any): string {
    if (!role) return 'role';
    
    if (role === 'client') {
      if (!progress.profile) return 'profile';
      if (!progress.payment) return 'payment';
      if (!progress.preferences) return 'preferences';
      return 'complete';
    } else if (role === 'worker') {
      if (!progress.basic) return 'basic';
      if (!progress.professional) return 'professional';
      if (!progress.pricing) return 'pricing';
      if (!progress.verification) return 'verification';
      if (!progress.financial) return 'financial';
      return 'complete';
    }
    return 'role';
  }

  private parseAddress(address: string): any {
    return {
      street: address,
      city: '',
      state: '',
      zip_code: '',
      country: 'Ghana',
    };
  }

  private parseExperience(experience: string | undefined): number {
    const match = experience?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async uploadFile(file: import('multer').File): Promise<string> {
    return await this.cloudinary.uploadImage(file);
  }
}
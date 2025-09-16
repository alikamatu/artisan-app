import { 
  BadRequestException, 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from 'src/entities/user.entity';

export interface UserProfileResponse {
  // Base user info
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
  firstName?: string;
  lastName?: string;
  address: string;

  // Profile data (from metadata or separate tables)
  bio?: string;
  profilePhoto?: string;
  businessName?: string;
  services?: string[];
  skills?: string[];
  experience?: string;
  hourlyRate?: number;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;

  paymentMethods: string[];
  mobileMoneyProvider?: string;
  bankName?: string;
  verificationStatus?: string;

  //worker specific
  education: string;
  description: string;
  certifications: string[];
  serviceArea: string;
  maxDistance: number;
  workingHours: string;
  availableDays: string;
  idType?: string;
  idDocument?: string;
  backgroundCheckConsent?: boolean;
  onboardingProgress?: number;

  // Client specific
  company?: string;
  totalJobsPosted?: number;
  averageRating?: number;
  
  // Metadata for additional info
  metadata?: Record<string, any>;
  
  // Public profile flag (used for filtering sensitive info)
  isPublicProfile?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ============ AUTHENTICATION METHODS ============

  async validateUser(email: string, pass: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return null;

    const isValid = await bcrypt.compare(pass, user.password_hash);
    return isValid ? user : null;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if user already exists
    const { data: existingUser } = await this.supabase
      .client
      .from('user')
      .select('id, is_verified')
      .eq('email', registerDto.email)
      .single();

    if (existingUser?.is_verified) {
      throw new ConflictException('User already exists');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const hashedPassword = await bcrypt.hash(registerDto.password_hash, 10);

    const userData = {
      ...registerDto,
      password_hash: hashedPassword,
      verification_token: verificationToken,
      verification_token_expires_at: tokenExpiry.toISOString(),
      is_verified: false,
      metadata: {
        profile: {
          onboardingCompleted: false,
          preferences: {},
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        }
      }
    };

    let user;
    if (existingUser && !existingUser.is_verified) {
      const { data, error } = await this.supabase
        .client
        .from('user')
        .update(userData)
        .eq('email', registerDto.email)
        .select('*')
        .single();

      if (error) throw new InternalServerErrorException(error.message || 'Failed to update user');
      user = data;
    } else {
      const { data, error } = await this.supabase
        .client
        .from('user')
        .insert([userData])
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') {
          throw new ConflictException('User already exists');
        }
        throw new InternalServerErrorException(error.message || 'Failed to create user');
      }
      user = data;
    }

    // Send verification email
    try {
      await this.mailService.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Remove sensitive data from response
    const { verification_token, verification_token_expires_at, password_hash, ...safeUser } = user;
    return safeUser;
  }

  async login(user: User, inputPassword: string) {
    const isMatch = await bcrypt.compare(inputPassword, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  // ============ USER PROFILE METHODS ============

  /**
   * Get current user's complete profile with all sensitive data
   */
  async getCurrentUserProfile(userId: string): Promise<UserProfileResponse> {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    // Fetch additional profile data based on role
    let profileData = {};
    
    if (user.role === 'worker') {
      const workerProfile = await this.getWorkerProfileData(userId);
      profileData = { ...profileData, ...workerProfile };
    } else if (user.role === 'client') {
      const clientProfile = await this.getClientProfileData(userId);
      profileData = { ...profileData, ...clientProfile };
    }

    return this.formatUserProfile(user, profileData, false); // false = include sensitive data
  }

  /**
   * Get public profile for any user (limited data)
   */
  async getPublicUserProfile(userId: string): Promise<UserProfileResponse> {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('id, name, role, region, is_verified, verification_level, created_at, updated_at, verified_at, metadata')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    // Fetch additional profile data based on role
    let profileData = {};
    
    if (user.role === 'worker') {
      const workerProfile = await this.getWorkerProfileData(userId);
      profileData = { ...profileData, ...workerProfile };
    } else if (user.role === 'client') {
      const clientProfile = await this.getClientProfileData(userId, true); // true = public only
      profileData = { ...profileData, ...clientProfile };
    }

    return this.formatUserProfile(user, profileData, true); // true = public profile
  }

  /**
   * Update user profile data
   */
  async updateUserProfile(userId: string, updateData: UpdateProfileDto): Promise<UserProfileResponse> {
    // Get current user data first
    const { data: currentUser, error: fetchError } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !currentUser) {
      throw new NotFoundException('User not found');
    }

    // Separate user table updates from metadata updates
    const userUpdates: any = {};
    const currentMetadata = currentUser.metadata || {};

    // Handle direct user table fields
    if (updateData.name !== undefined) userUpdates.name = updateData.name;
    if (updateData.phone !== undefined) userUpdates.phone = updateData.phone;
    if (updateData.region !== undefined) userUpdates.region = updateData.region;

    // Handle nested metadata updates
    const metadataUpdates: any = { ...currentMetadata };

    // Profile section
    if (updateData.profile !== undefined) {
      metadataUpdates.profile = {
        ...currentMetadata.profile,
        ...updateData.profile
      };
    }

    // Professional section
    if (updateData.professional !== undefined) {
      metadataUpdates.professional = {
        ...currentMetadata.professional,
        ...updateData.professional
      };
    }

    // Pricing section
    if (updateData.pricing !== undefined) {
      metadataUpdates.pricing = {
        ...currentMetadata.pricing,
        ...updateData.pricing
      };
    }

    // Financial section
    if (updateData.financial !== undefined) {
      metadataUpdates.financial = {
        ...currentMetadata.financial,
        ...updateData.financial
      };
    }

    // Verification section
    if (updateData.verification !== undefined) {
      metadataUpdates.verification = {
        ...currentMetadata.verification,
        ...updateData.verification
      };
    }

    // Onboarding progress section
    if (updateData.onboarding_progress !== undefined) {
      metadataUpdates.onboarding_progress = {
        ...currentMetadata.onboarding_progress,
        ...updateData.onboarding_progress
      };
    }

    // Handle legacy flat fields for backward compatibility
    if (updateData.bio !== undefined) {
      if (!metadataUpdates.profile) metadataUpdates.profile = {};
      metadataUpdates.profile.bio = updateData.bio;
    }

    if (updateData.profilePhoto !== undefined) {
      if (!metadataUpdates.profile) metadataUpdates.profile = {};
      metadataUpdates.profile.photo = updateData.profilePhoto;
    }

    if (updateData.businessName !== undefined) {
      if (!metadataUpdates.profile) metadataUpdates.profile = {};
      metadataUpdates.profile.businessName = updateData.businessName;
    }

    if (updateData.services !== undefined) {
      if (!metadataUpdates.professional) metadataUpdates.professional = {};
      metadataUpdates.professional.services = updateData.services;
    }

    if (updateData.skills !== undefined) {
      if (!metadataUpdates.professional) metadataUpdates.professional = {};
      metadataUpdates.professional.skills = updateData.skills;
    }

    if (updateData.experience !== undefined) {
      if (!metadataUpdates.professional) metadataUpdates.professional = {};
      metadataUpdates.professional.experience = updateData.experience;
    }

    if (updateData.hourlyRate !== undefined) {
      if (!metadataUpdates.pricing) metadataUpdates.pricing = {};
      metadataUpdates.pricing.hourly_rate = updateData.hourlyRate;
    }

    if (updateData.company !== undefined) {
      if (!metadataUpdates.profile) metadataUpdates.profile = {};
      metadataUpdates.profile.company = updateData.company;
    }

    // Always update metadata if we have any changes
    if (JSON.stringify(metadataUpdates) !== JSON.stringify(currentMetadata)) {
      userUpdates.metadata = metadataUpdates;
    }

    // Update user table if we have changes
    if (Object.keys(userUpdates).length > 0) {
      userUpdates.updated_at = new Date().toISOString();
      
      const { error } = await this.supabase
        .client
        .from('user')
        .update(userUpdates)
        .eq('id', userId);

      if (error) {
        console.error('Failed to update profile:', error);
        throw new InternalServerErrorException('Failed to update profile');
      }
    }

    // Return updated profile
    return this.getCurrentUserProfile(userId);
  }


  /**
   * Update user notification preferences
   */
  async updateUserNotifications(userId: string, notifications: Record<string, boolean>): Promise<{ message: string }> {
    // Get current metadata
    const { data: currentUser } = await this.supabase
      .client
      .from('user')
      .select('metadata')
      .eq('id', userId)
      .single();

    const currentMetadata = currentUser?.metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      profile: {
        ...currentMetadata.profile,
        notifications: {
          ...currentMetadata.profile?.notifications,
          ...notifications
        }
      }
    };

    const { error } = await this.supabase
      .client
      .from('user')
      .update({ 
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new InternalServerErrorException('Failed to update notifications');
    }

    return { message: 'Notifications updated successfully' };
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // Get current user
    const { data: user } = await this.supabase
      .client
      .from('user')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error } = await this.supabase
      .client
      .from('user')
      .update({ 
        password_hash: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new InternalServerErrorException('Failed to change password');
    }

    return { message: 'Password changed successfully' };
  }

  /**
   * Refresh user token
   */
  async refreshUserToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ============ EMAIL VERIFICATION METHODS ============

  async verifyEmail(token: string): Promise<{ message: string; user?: Partial<User> }> {
    if (!token || token.length !== 64) {
      throw new BadRequestException('Invalid verification token format');
    }

    const { data: tokenCheck, error: tokenCheckError } = await this.supabase
      .client
      .from('user')
      .select('id, email, verification_token, verification_token_expires_at, is_verified')
      .eq('verification_token', token)
      .single();

    if (tokenCheckError && tokenCheckError.code !== 'PGRST116') {
      throw new InternalServerErrorException('Database error during verification');
    }

    if (!tokenCheck) {
      throw new BadRequestException('Invalid verification token');
    }

    if (tokenCheck.is_verified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check expiry
    const now = new Date();
    const expiryDate = new Date(tokenCheck.verification_token_expires_at);

    if (now > expiryDate) {
      throw new BadRequestException('Verification token has expired. Please request a new verification email.');
    }

    // Update user
    const { data: updatedUser, error: updateError } = await this.supabase
      .client
      .from('user')
      .update({ 
        is_verified: true, 
        verification_token: null,
        verification_token_expires_at: null,
        verified_at: new Date().toISOString()
      })
      .eq('id', tokenCheck.id)
      .select('id, email, is_verified, verified_at')
      .single();

    if (updateError) {
      throw new InternalServerErrorException('Failed to verify email');
    }

    return {
      message: 'Email verified successfully',
      user: updatedUser
    };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const { data: user, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_verified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new token
    const { error: updateError } = await this.supabase
      .client
      .from('user')
      .update({
        verification_token: verificationToken,
        verification_token_expires_at: tokenExpiry.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw new InternalServerErrorException('Failed to update verification token');
    }

    // Send new verification email
    try {
      await this.mailService.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send verification email');
    }

    return { message: 'Verification email sent successfully' };
  }

  // ============ PASSWORD RESET METHODS ============

  async requestPasswordReset(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return; // Don't reveal if user exists
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour
    
    await this.supabase.client
      .from('user')
      .update({ 
        password_reset_token: resetToken,
        reset_token_expiry: expiry
      })
      .eq('id', user.id);
    
    await this.mailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.findUserByResetToken(dto.token);

    if (!user || user.reset_token_expiry < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.supabase.client
      .from('user')
      .update({ 
        password_hash: hashedPassword,
        password_reset_token: null,
        reset_token_expiry: null
      })
      .eq('id', user.id);

    return { message: 'Password has been reset successfully' };
  }

  // ============ ADMIN METHODS ============

  async getAllUsers(): Promise<UserProfileResponse[]> {
    const { data: users, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }

    return users.map(user => this.formatUserProfile(user, {}, false));
  }

  async adminVerifyUser(userId: string): Promise<{ message: string }> {
    const { error } = await this.supabase
      .client
      .from('user')
      .update({ 
        is_verified: true,
        verification_level: 1,
        verified_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new InternalServerErrorException('Failed to verify user');
    }

    return { message: 'User verified successfully' };
  }

  // ============ PRIVATE HELPER METHODS ============

  private async getWorkerProfileData(userId: string): Promise<any> {
    // If you have a separate worker_profile table
    const { data: workerProfile } = await this.supabase
      .client
      .from('worker_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Calculate additional stats
    const { data: jobs } = await this.supabase
      .client
      .from('job')
      .select('id, status')
      .eq('worker_id', userId);

    const totalJobs = jobs?.length || 0;
    const completedJobs = jobs?.filter(job => job.status === 'completed').length || 0;

    return {
      ...workerProfile,
      totalJobs,
      completedJobs,
      rating: workerProfile?.rating || 4.5 // default rating
    };
  }

  private async getClientProfileData(userId: string, publicOnly: boolean = false): Promise<any> {
    // Fetch client-specific data
    const { data: jobs } = await this.supabase
      .client
      .from('job')
      .select('id, status')
      .eq('client_id', userId);

    const totalJobsPosted = jobs?.length || 0;

    // Only include sensitive data if not public profile
    const clientData: any = {
      totalJobsPosted
    };

    if (!publicOnly) {
      // Add more detailed client info for private profile
      const { data: reviews } = await this.supabase
        .client
        .from('review')
        .select('rating')
        .eq('subject_id', userId);

      const averageRating = reviews?.length 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 4.2;

      clientData.averageRating = averageRating;
    }

    return clientData;
  }

  private formatUserProfile(user: any, profileData: any, isPublic: boolean): UserProfileResponse {
    const metadata = user.metadata || {};
    
    const baseProfile: UserProfileResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
      isVerified: user.is_verified,
      verificationLevel: user.verification_level || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      verifiedAt: user.verified_at,
      isPublicProfile: isPublic,
      ...profileData
    };

    // Add non-sensitive fields for all profiles
    if (user.region) baseProfile.region = user.region;

    // Extract and flatten metadata for easier frontend consumption
    if (metadata.profile) {
      if (metadata.profile.bio) baseProfile.bio = metadata.profile.bio;
      if (metadata.profile.photo) baseProfile.profilePhoto = metadata.profile.photo;
      if (metadata.profile.businessName) baseProfile.businessName = metadata.profile.businessName;
      if (metadata.profile.firstName) baseProfile.firstName = metadata.profile.firstName;
      if (metadata.profile.lastName) baseProfile.lastName = metadata.profile.lastName;
      if (metadata.profile.address) baseProfile.address = metadata.profile.address;
      if (metadata.profile.company) baseProfile.company = metadata.profile.company;
    }

    // Add professional data for workers
    if (user.role === 'worker' && metadata.professional) {
      baseProfile.services = metadata.professional.services || [];
      baseProfile.skills = metadata.professional.skills || [];
      baseProfile.experience = metadata.professional.experience;
      baseProfile.education = metadata.professional.education;
      baseProfile.description = metadata.professional.description;
      baseProfile.certifications = metadata.professional.certifications || [];
    }

    // Add pricing data for workers
    if (user.role === 'worker' && metadata.pricing) {
      baseProfile.hourlyRate = metadata.pricing.hourly_rate;
      baseProfile.serviceArea = metadata.pricing.service_area;
      baseProfile.maxDistance = metadata.pricing.max_distance;
      baseProfile.workingHours = metadata.pricing.working_hours;
      baseProfile.availableDays = metadata.pricing.available_days || [];
    }

    // Add financial data (only for private profiles)
    if (!isPublic && metadata.financial) {
      baseProfile.paymentMethods = metadata.financial.payment_methods || [];
      baseProfile.mobileMoneyProvider = metadata.financial.mobile_money_provider;
      baseProfile.bankName = metadata.financial.bank_name;
    }

    // Add verification data
    if (metadata.verification) {
      baseProfile.verificationStatus = metadata.verification.verification_status;
      baseProfile.idType = metadata.verification.id_type;
      if (!isPublic) {
        baseProfile.idDocument = metadata.verification.id_document;
        baseProfile.backgroundCheckConsent = metadata.verification.background_check_consent;
      }
    }

    // Add onboarding progress (only for private profiles)
    if (!isPublic && metadata.onboarding_progress) {
      baseProfile.onboardingProgress = metadata.onboarding_progress;
    }

    // Only include sensitive data for private profiles
    if (!isPublic) {
      baseProfile.email = user.email;
      baseProfile.phone = user.phone;
      baseProfile.metadata = user.metadata;
    }

    return baseProfile;
  }
      
  private async findUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('email', email)
      .single();
    
    return error ? null : data;
  }

  private async findUserByResetToken(token: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .client
      .from('user')
      .select('*')
      .eq('password_reset_token', token)
      .single();
    
    return error ? null : data;
  }
}
import { Controller, Get, Put, Post, Body, UseGuards, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { User } from '../entities/user.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getMyProfile(@CurrentUser() user: User) {
    if (user.role === 'client') {
      return this.profileService.getClientProfile(user.id);
    } else if (user.role === 'worker') {
      return this.profileService.getWorkerProfile(user.id);
    } else {
      return this.profileService.getUserProfile(user.id);
    }
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string, @CurrentUser() user: User) {
    // Basic profile info (public view)
    const profile = await this.profileService.getUserProfile(userId);
    
    if (profile.role === 'worker') {
      const workerProfile = await this.profileService.getWorkerProfile(userId);
      // Return public worker info only
      return {
        id: workerProfile.id,
        name: workerProfile.name,
        role: workerProfile.role,
        businessName: workerProfile.businessName,
        description: workerProfile.description,
        services: workerProfile.services,
        hourlyRate: workerProfile.hourlyRate,
        serviceArea: workerProfile.serviceArea,
        skills: workerProfile.skills,
        rating: workerProfile.rating,
        totalJobs: workerProfile.totalJobs,
        profileImage: workerProfile.profileImage,
        verificationStatus: workerProfile.verificationStatus,
        joinedDate: workerProfile.joinedDate,
        // Add metadata for consistency
        metadata: workerProfile.metadata,
        createdAt: workerProfile.createdAt,
      };
    }

    // For clients, return limited public info
    return {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      joinedDate: profile.createdAt,
      // Add basic info for consistency
      metadata: profile.metadata,
      createdAt: profile.createdAt,
    };
  }

  @Put()
  async updateProfile(@CurrentUser() user: User, @Body() updateData: any) {
    return this.profileService.updateUserProfile(user.id, updateData);
  }

  // @Post('photo')
  // @UseInterceptors(FileInterceptor('photo'))
  // async uploadPhoto(
  //   @CurrentUser() user: User,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }

  //   // Here you would typically upload to a cloud storage service
  //   // For now, we'll just return a placeholder
  //   const photoUrl = await this.profileService.uploadPhoto(user.id, file);
    
  //   return { photoUrl };
  // }
}
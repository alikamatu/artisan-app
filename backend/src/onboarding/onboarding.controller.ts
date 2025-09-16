import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  UseGuards, 
  UploadedFile, 
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
  Res,
  Headers,
  Request,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OnboardingService } from './onboarding.service';
import { CompleteOnboardingDto, UpdateOnboardingStepDto } from '../auth/dto/onboarding.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly jwtService: JwtService,
  ) {}

  // Debug endpoint to test token validation
  @Get('debug-token')
  async debugToken(@Headers('authorization') auth: string) {
    try {
      console.log('=== TOKEN DEBUG ===');
      console.log('Authorization header:', auth ? 'Present' : 'Missing');
      
      if (!auth || !auth.startsWith('Bearer ')) {
        return { error: 'No Bearer token provided', hasAuth: !!auth };
      }

      const token = auth.split(' ')[1];
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 30) + '...');

      // Verify the token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      console.log('JWT payload:', {
        userId: payload.sub,
        email: payload.email,
        exp: new Date(payload.exp * 1000).toISOString(),
      });

      return { 
        message: 'Token is valid',
        userId: payload.sub,
        email: payload.email,
        expires: new Date(payload.exp * 1000).toISOString(),
      };
    } catch (error) {
      console.error('JWT verification error:', {
        name: error.name,
        message: error.message,
      });
      
      return { 
        error: 'Token verification failed', 
        details: error.message,
        name: error.name,
      };
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getOnboardingStatus(@CurrentUser() user: User) {
    try {
      console.log('=== ONBOARDING STATUS REQUEST ===');
      console.log('User from decorator:', user ? `ID: ${user.id}, Email: ${user.email}` : 'null');
      
      if (!user || !user.id) {
        console.log('ERROR: No user found in request');
        throw new UnauthorizedException('User not found in request');
      }

      const status = await this.onboardingService.getOnboardingStatus(user.id);
      console.log('Onboarding status retrieved:', {
        completed: status.completed,
        role: status.role,
        nextStep: status.nextStep,
        progressKeys: Object.keys(status.progress || {}),
      });
      
      return status;
    } catch (error) {
      console.error('getOnboardingStatus error:', {
        name: error.name,
        message: error.message,
        userId: user?.id,
      });
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException({
        message: 'Failed to get onboarding status',
        error: error.message,
      });
    }
  }

  @Put('step')
  @UseGuards(JwtAuthGuard)
  async updateOnboardingStep(
    @CurrentUser() user: User,
    @Body() stepData: UpdateOnboardingStepDto,
  ) {
    try {
      console.log('=== UPDATE ONBOARDING STEP ===');
      console.log('User ID:', user?.id);
      console.log('Step data:', {
        role: stepData.role,
        step: stepData.step,
        dataKeys: Object.keys(stepData.data || {}),
      });

      if (!user || !user.id) {
        throw new UnauthorizedException('User not found');
      }

      const result = await this.onboardingService.updateOnboardingStep(user.id, stepData);
      console.log('Step update result:', result);
      
      return result;
    } catch (error) {
      console.error('updateOnboardingStep error:', error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException({
        message: 'Failed to update onboarding step',
        error: error.message,
      });
    }
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard)
  async completeOnboarding(
    @CurrentUser() user: User,
    @Body() onboardingData: CompleteOnboardingDto,
  ) {
    try {
      console.log('=== COMPLETE ONBOARDING ===');
      console.log('User ID:', user?.id);
      console.log('Role:', onboardingData.role);

      if (!user || !user.id) {
        throw new UnauthorizedException('User not found');
      }

      const result = await this.onboardingService.completeOnboarding(user.id, onboardingData);
      console.log('Onboarding completion result:', result);
      
      return result;
    } catch (error) {
      console.error('completeOnboarding error:', error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException({
        message: 'Failed to complete onboarding',
        error: error.message,
      });
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
      }),
    )
    file: import('multer').File,
  ) {
    try {
      console.log('=== FILE UPLOAD ===');
      console.log('User ID:', user?.id);
      console.log('File:', file ? `${file.originalname} (${file.size} bytes)` : 'null');

      if (!user || !user.id) {
        throw new UnauthorizedException('User not found');
      }

      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const url = await this.onboardingService.uploadFile(file);
      console.log('File uploaded successfully:', url);
      
      return { url };
    } catch (error) {
      console.error('uploadFile error:', error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException({
        message: 'Failed to upload file',
        error: error.message,
      });
    }
  }

  // Specific step endpoints with better error handling
  @Put('client/profile')
  @UseGuards(JwtAuthGuard)
  async updateClientProfile(@CurrentUser() user: User, @Body() profileData: any) {
    return this.updateOnboardingStep(user, {
      role: 'client' as any,
      step: 'profile',
      data: profileData,
    });
  }

  @Put('client/payment')
  @UseGuards(JwtAuthGuard)
  async updateClientPayment(@CurrentUser() user: User, @Body() paymentData: any) {
    return this.updateOnboardingStep(user, {
      role: 'client' as any,
      step: 'payment',
      data: paymentData,
    });
  }

  @Put('client/preferences')
  @UseGuards(JwtAuthGuard)
  async updateClientPreferences(@CurrentUser() user: User, @Body() preferencesData: any) {
    return this.updateOnboardingStep(user, {
      role: 'client' as any,
      step: 'preferences',
      data: preferencesData,
    });
  }

  @Put('worker/basic')
  @UseGuards(JwtAuthGuard)
  async updateWorkerBasic(@CurrentUser() user: User, @Body() basicData: any) {
    return this.updateOnboardingStep(user, {
      role: 'worker' as any,
      step: 'basic',
      data: basicData,
    });
  }

  @Put('worker/professional')
  @UseGuards(JwtAuthGuard)
  async updateWorkerProfessional(@CurrentUser() user: User, @Body() professionalData: any) {
    return this.updateOnboardingStep(user, {
      role: 'worker' as any,
      step: 'professional',
      data: professionalData,
    });
  }

  @Put('worker/pricing')
  @UseGuards(JwtAuthGuard)
  async updateWorkerPricing(@CurrentUser() user: User, @Body() pricingData: any) {
    return this.updateOnboardingStep(user, {
      role: 'worker' as any,
      step: 'pricing',
      data: pricingData,
    });
  }

  @Put('worker/verification')
  @UseGuards(JwtAuthGuard)
  async updateWorkerVerification(@CurrentUser() user: User, @Body() verificationData: any) {
    return this.updateOnboardingStep(user, {
      role: 'worker' as any,
      step: 'verification',
      data: verificationData,
    });
  }

  @Put('worker/financial')
  @UseGuards(JwtAuthGuard)
  async updateWorkerFinancial(@CurrentUser() user: User, @Body() financialData: any) {
    return this.updateOnboardingStep(user, {
      role: 'worker' as any,
      step: 'financial',
      data: financialData,
    });
  }
}
// src/auth/dto/onboarding.dto.ts
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsEnum, IsArray, IsObject, IsNumber, IsBoolean, ValidateNested, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum OnboardingRole {
  CLIENT = 'client',
  WORKER = 'worker',
}

// Base profile data
export class BaseProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  photo?: string;
}

// Client specific DTOs
export class ClientProfileDto extends BaseProfileDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class ClientPaymentDto {
  @IsString()
  cardNumber: string;

  @IsString()
  expiryDate: string;

  @IsString()
  cvv: string;

  @IsString()
  cardholderName: string;

  @IsString()
  billingAddress: string;

  @IsString()
  paymentMethod: string; // 'card' | 'bank' | 'mobile_money'
}

export class ClientPreferencesDto {
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  budgetRange: [number, number];

  @IsObject()
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Worker specific DTOs
export class WorkerBasicInfoDto extends BaseProfileDto {
  @IsString()
  businessName: string;
}

export class WorkerProfessionalInfoDto {
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsString()
  experience: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsString()
  education?: string;
}

export class WorkerPricingAvailabilityDto {
  @IsNumber()
  hourlyRate: number;

  @IsArray()
  @IsString({ each: true })
  availableDays: string[];

  @IsObject()
  workingHours: {
    start: string;
    end: string;
  };

  @IsString()
  serviceArea: string;

  @IsNumber()
  maxDistance: number;
}

export class WorkerVerificationDto {
  @IsString()
  idType: string; // 'passport' | 'national_id' | 'drivers_license'

  @IsString()
  idNumber: string;

  @IsOptional()
  @IsString()
  idDocument?: string; // Base64 encoded document

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioImages?: string[];

  @IsBoolean()
  backgroundCheckConsent: boolean;
}

export class WorkerFinancialSetupDto {
  @IsString()
  accountType: string; // 'bank' | 'mobile_money' | 'paypal'

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  routingNumber?: string;

  @IsOptional()
  @IsString()
  mobileMoneyProvider?: string;
}

// Main onboarding DTO
export class CompleteOnboardingDto {
  @IsEnum(OnboardingRole)
  role: OnboardingRole;

  // Profile data (required for both)
  @ValidateNested()
  @Type(() => BaseProfileDto)
  profile: ClientProfileDto | WorkerBasicInfoDto;

  // Client specific fields
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientPaymentDto)
  payment?: ClientPaymentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClientPreferencesDto)
  preferences?: ClientPreferencesDto;

  // Worker specific fields
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkerProfessionalInfoDto)
  professional?: WorkerProfessionalInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkerPricingAvailabilityDto)
  pricing?: WorkerPricingAvailabilityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkerVerificationDto)
  verification?: WorkerVerificationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkerFinancialSetupDto)
  financial?: WorkerFinancialSetupDto;
}

export class UpdateOnboardingStepDto {
  @IsEnum(OnboardingRole)
  role: OnboardingRole;

  @IsString()
  step: string;

  @IsObject()
  data: any;
}
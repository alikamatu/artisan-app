import { IsOptional, IsString, IsEmail, IsNumber, IsArray, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProfileDto {
  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  company?: string;
}

class ProfessionalDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}

class WorkingHoursDto {
  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;
}

class PricingDto {
  @IsOptional()
  @IsNumber()
  hourly_rate?: number;

  @IsOptional()
  @IsNumber()
  max_distance?: number;

  @IsOptional()
  @IsString()
  service_area?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  working_hours?: WorkingHoursDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  available_days?: string[];
}

class FinancialDto {
  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  account_name?: string;

  @IsOptional()
  @IsString()
  account_type?: string;

  @IsOptional()
  @IsString()
  account_number?: string;

  @IsOptional()
  @IsString()
  routing_number?: string;

  @IsOptional()
  @IsString()
  mobile_money_provider?: string;
}

class VerificationDto {
  @IsOptional()
  @IsString()
  id_type?: string;

  @IsOptional()
  @IsString()
  id_document?: string;

  @IsOptional()
  @IsString()
  verification_status?: string;

  @IsOptional()
  @IsBoolean()
  background_check_consent?: boolean;
}

class OnboardingProgressDto {
  @IsOptional()
  @IsBoolean()
  basic?: boolean;

  @IsOptional()
  @IsBoolean()
  pricing?: boolean;

  @IsOptional()
  @IsBoolean()
  financial?: boolean;

  @IsOptional()
  @IsBoolean()
  professional?: boolean;

  @IsOptional()
  @IsBoolean()
  verification?: boolean;
}

export class UpdateProfileDto {
  // Direct user table fields
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  region?: string;

  // Nested metadata sections
  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfessionalDto)
  professional?: ProfessionalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FinancialDto)
  financial?: FinancialDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VerificationDto)
  verification?: VerificationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardingProgressDto)
  onboarding_progress?: OnboardingProgressDto;

  // Legacy flat fields for backward compatibility
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  company?: string;
}
import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  IsEnum, 
  IsDateString,
  Min,
  MaxLength,
  MinLength,
  IsPositive,
  ValidateIf,
  IsObject,
  ValidateNested,
  IsBoolean,
  Max
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { JobUrgency, JobCategory, GhanaRegion } from 'src/entities/job.entity';

class LocationDto {
  @IsEnum(GhanaRegion, { message: 'Region must be a valid Ghana region' })
  region: GhanaRegion;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'City cannot exceed 100 characters' })
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Specific address cannot exceed 200 characters' })
  specific_address?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}

class AvailabilityRequirementDto {
  @IsBoolean()
  immediate: boolean;

  @IsBoolean()
  flexible_timing: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  specific_times?: string[];
}

class DistancePreferenceDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(1000)
  max_distance_km?: number;

  @IsBoolean()
  travel_compensation: boolean;
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  @MaxLength(3000, { message: 'Description cannot exceed 3000 characters' })
  description: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject()
  location: LocationDto;

  @IsEnum(JobCategory, { message: 'Category must be a valid job category' })
  category: JobCategory;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Subcategory cannot exceed 100 characters' })
  subcategory?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Budget minimum must be a valid number with max 2 decimal places' })
  @IsPositive({ message: 'Budget minimum must be positive' })
  @Transform(({ value }) => parseFloat(value))
  budget_min: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Budget maximum must be a valid number with max 2 decimal places' })
  @IsPositive({ message: 'Budget maximum must be positive' })
  @Transform(({ value }) => parseFloat(value))
  @ValidateIf((o) => o.budget_max >= o.budget_min, {
    message: 'Budget maximum must be greater than or equal to budget minimum'
  })
  budget_max: number;

  @IsEnum(GhanaRegion, { each: true, message: 'Region must be a valid Ghana region' })
  @IsOptional()
  region: GhanaRegion[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(50, { each: true, message: 'Each skill cannot exceed 50 characters' })
  required_skills?: string[];

  @IsEnum(JobUrgency, { message: 'Urgency must be one of: low, medium, high, urgent' })
  urgency: JobUrgency;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  start_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Estimated duration cannot exceed 100 characters' })
  estimated_duration?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityRequirementDto)
  @IsObject()
  availability_requirement?: AvailabilityRequirementDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DistancePreferenceDto)
  @IsObject()
  distance_preference?: DistancePreferenceDto;
}

import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, Min, Max, IsArray, IsString, IsPositive, MaxLength, IsBoolean, IsNumber, MinLength, IsUUID, isUUID } from 'class-validator';
import { CreateJobDto } from './create-job.dto';
import { JobStatus, JobCurrentStatus } from 'src/entities/job.entity';
import { Transform, Type } from 'class-transformer';
import { JobUrgency, JobCategory, GhanaRegion } from 'src/entities/job.entity';



// dto/update-job.dto.ts - Updated JobFiltersDto with proper validation


export class JobFiltersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50) // Prevent excessive requests
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Search term must be at least 2 characters long' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length >= 2 ? trimmed : undefined;
    }
    return value;
  })
  search?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsEnum(JobCurrentStatus)
  current_status?: JobCurrentStatus;

  @IsOptional()
  @IsEnum(JobUrgency)
  urgency?: JobUrgency;

  @IsOptional()
  @IsEnum(JobCategory)
  category?: JobCategory;

  @IsOptional()
  @IsEnum(GhanaRegion)
  region?: GhanaRegion;

  @IsOptional()
  @IsString()
  @MinLength(2)
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_budget?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      // Filter out invalid skills and ensure minimum length
      const validSkills = value
        .filter(skill => typeof skill === 'string' && skill.trim().length >= 2)
        .map(skill => skill.trim().toLowerCase());
      return validSkills.length > 0 ? validSkills : undefined;
    }
    if (typeof value === 'string' && value.trim().length >= 2) {
      return [value.trim().toLowerCase()];
    }
    return undefined;
  })
  required_skills?: string[];

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  min_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_review_count?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  verified_clients_only?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  with_reviews_only?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100) // Maximum 100km radius
  @Type(() => Number)
  max_distance_km?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const validColumns = [
      'created_at', 'updated_at', 'budget_min', 'budget_max', 
      'views_count', 'applications_count', 'urgency', 'title'
    ];
    return validColumns.includes(value) ? value : 'created_at';
  })
  sort_by?: string = 'created_at';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return ['ASC', 'DESC'].includes(value) ? value : 'DESC';
  })
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  availability_filter?: string;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsEnum(JobCurrentStatus)
  current_status?: JobCurrentStatus;

  @IsOptional()
  @IsUUID()
  selected_worker_id?: string;

}
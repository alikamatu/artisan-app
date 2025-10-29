import { IsString, IsNumber, IsUUID, IsDateString, IsNotEmpty, Min, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../applications.service';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Rejection reason must not exceed 500 characters' })
  rejection_reason?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Proposed budget must be greater than 0' })
  @IsOptional()
  proposed_budget?: number;

  @IsString()
  @IsOptional()
  estimated_completion_time?: string;



  @IsDateString()
  @IsOptional()
  completion_date?: string;

  @IsDateString()
  @IsOptional()
  availability_start_date?: string;
}
export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  job_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Proposed budget must be greater than 0' })
  proposed_budget: number;

  @IsString()
  @IsOptional()
  estimated_completion_time: string;

  @IsDateString()
  @IsOptional()
  availability_start_date: string;
}
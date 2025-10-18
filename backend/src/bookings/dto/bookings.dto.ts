import { IsString, IsNumber, IsDateString, IsOptional, Min, MaxLength, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MilestonePaymentDto {
  @IsString()
  @MaxLength(200)
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  due_date: string;
}

export class CreateBookingDto {
  @IsUUID()
  application_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  expected_completion_date: string;

  @IsNumber()
  @Min(0.01)
  final_budget: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestonePaymentDto)
  @IsOptional()
  milestone_payments?: MilestonePaymentDto[];
}

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  status?: 'active' | 'completed' | 'cancelled' | 'disputed';

  @IsDateString()
  @IsOptional()
  expected_completion_date?: string;

  @IsDateString()
  @IsOptional()
  actual_completion_date?: string;

  @IsUUID()
  @IsOptional()
  selected_worker_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class BookingFiltersDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: 'active' | 'completed' | 'cancelled' | 'disputed';

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  worker_id?: string;

  @IsOptional()
  @IsUUID()
  job_id?: string;

  @IsOptional()
  @IsString()
  sort_by?: 'created_at' | 'start_date' | 'expected_completion_date' | 'final_budget';

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;
}
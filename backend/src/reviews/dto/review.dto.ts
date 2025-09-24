import { IsString, IsNumber, IsEnum, IsOptional, Min, Max, MaxLength, IsUUID, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewCategoryDto {
  @IsString()
  @MaxLength(50)
  category: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class CreateReviewDto {
  @IsUUID()
  booking_id: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @IsString()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  comment: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewCategoryDto)
  @IsOptional()
  categories?: ReviewCategoryDto[];

  @IsBoolean()
  @IsOptional()
  is_public?: boolean = true;
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsOptional()
  rating?: number;

  @IsString()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  @IsOptional()
  comment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewCategoryDto)
  @IsOptional()
  categories?: ReviewCategoryDto[];

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class ReviewFiltersDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  reviewee_id?: string;

  @IsOptional()
  @IsUUID()
  reviewer_id?: string;

  @IsOptional()
  @IsUUID()
  booking_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  min_rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  max_rating?: number;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsString()
  sort_by?: 'created_at' | 'rating';

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';
}

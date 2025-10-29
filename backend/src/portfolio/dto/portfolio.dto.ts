import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsBoolean, IsUUID, Min, MaxLength, IsUrl } from 'class-validator';
import { PortfolioCategory, PortfolioItemType } from '../../entities/portfolio.entity';

export class CreatePortfolioDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(PortfolioCategory)
  category: PortfolioCategory;

  @IsEnum(PortfolioItemType)
  type: PortfolioItemType;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  media_urls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  project_date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  project_budget?: number;

  @IsString()
  @IsOptional()
  testimonials?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  client_name?: string;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  challenges?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  solutions?: string[];
}

export class UpdatePortfolioDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(PortfolioCategory)
  @IsOptional()
  category?: PortfolioCategory;

  @IsEnum(PortfolioItemType)
  @IsOptional()
  type?: PortfolioItemType;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  media_urls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  project_date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  project_budget?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  client_name?: string;

  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}

export class PortfolioFiltersDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 12;

  @IsOptional()
  @IsUUID()
  worker_id?: string;

  @IsOptional()
  @IsEnum(PortfolioCategory)
  category?: PortfolioCategory;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean = true;

  @IsOptional()
  @IsString()
  sort_by?: 'created_at' | 'views_count' | 'likes_count' | 'project_date';

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';
}
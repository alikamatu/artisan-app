export enum PortfolioCategory {
  ALL = 'all',
  CONSTRUCTION = 'construction',
  DESIGN = 'design',
  LANDSCAPING = 'landscaping',
  ROOFING = 'roofing',
  HVAC = 'hvac',
  RENOVATION = 'renovation',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  CARPENTRY = 'carpentry',
  PAINTING = 'painting',
  CLEANING = 'cleaning',
  GARDENING = 'gardening',
  REPAIRS = 'repairs',
  OTHER = 'other'
}

export enum PortfolioItemType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LINK = 'link'
}

export interface PortfolioItem {
  id: string;
  worker_id: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  type: PortfolioItemType;
  media_urls: string[];
  tags: string[];
  project_date: string;
  location: string;
  project_budget: number;
  duration: string;
  client_name: string;
  testimonials: string;
  is_published: boolean;
  views_count: number;
  likes_count: number;
  metadata: {
    featured_image?: string;
    image_count?: number;
    video_duration?: string;
    file_size?: string;
    before_after_images?: string[];
    challenges?: string[];
    solutions?: string[];
    testimonials?: string;
  };
  created_at: string;
  updated_at: string;
  worker?: {
    id: string;
    name: string;
    display_name?: string;
    profile_photo?: string;
  };
  has_liked?: boolean;
}

export interface CreatePortfolioDto {
  title: string;
  description: string;
  category: PortfolioCategory;
  type: PortfolioItemType;
  media_urls: string[];
  tags: string[];
  project_date?: string;
  location?: string;
  project_budget?: number;
  duration?: string;
  client_name?: string;
  is_published?: boolean;
  challenges?: string[];
  solutions?: string[];
  testimonials?: string;
}

export interface UpdatePortfolioDto extends Partial<CreatePortfolioDto> {}

export interface PortfolioFilters {
  worker_id?: string;
  category?: PortfolioCategory;
  search?: string;
  is_published?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface PortfolioListResponse {
  items: PortfolioItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: { category: PortfolioCategory; count: number }[];
}

export interface PortfolioStats {
  totalProjects: number;
  totalViews: number;
  totalLikes: number;
  photoProjects: number;
}
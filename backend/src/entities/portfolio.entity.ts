import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';

export enum PortfolioItemType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LINK = 'link'
}

export enum PortfolioCategory {
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

@Entity('portfolio_items')
@Index(['worker_id', 'is_published'])
@Index(['category', 'created_at'])
@Index(['worker_id', 'created_at'])
export class PortfolioItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  worker_id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PortfolioCategory
  })
  category: PortfolioCategory;

  @Column({
    type: 'enum',
    enum: PortfolioItemType,
    default: PortfolioItemType.IMAGE
  })
  type: PortfolioItemType;

  @Column({ type: 'jsonb', default: [] })
  media_urls: string[]; // Array of Cloudinary URLs

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  project_date: string; // When the project was completed

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  project_budget: number;

  @Column({ type: 'text', nullable: true })
  duration: string; // How long the project took

  @Column({ type: 'text', nullable: true })
  client_name: string; // Optional: Client name for reference

  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  @Column({ type: 'int', default: 0 })
  views_count: number;

  @Column({ type: 'int', default: 0 })
  likes_count: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    featured_image?: string;
    image_count?: number;
    video_duration?: string;
    file_size?: string;
    before_after_images?: string[]; // URLs for before/after comparison
    challenges?: string[]; // Project challenges overcome
    solutions?: string[]; // Solutions implemented
  };

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  testimonials: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, user => user.portfolioItems)
  @JoinColumn({ name: 'worker_id' })
  worker: User;
}
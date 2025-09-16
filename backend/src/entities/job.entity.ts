import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { JobApplication } from './job-application.entity';

export enum JobStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum JobCurrentStatus {
  OPEN = 'open',
  PROPOSED = 'proposed',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum JobUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum JobCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  TUTORING = 'tutoring',
  CLEANING = 'cleaning',
  CARPENTRY = 'carpentry',
  PAINTING = 'painting',
  GARDENING = 'gardening',
  REPAIRS = 'repairs',
  DELIVERY = 'delivery',
  TECH_SUPPORT = 'tech_support',
  PERSONAL_CARE = 'personal_care',
  AUTOMOTIVE = 'automotive',
  BEAUTY = 'beauty',
  FITNESS = 'fitness',
  EVENT_PLANNING = 'event_planning',
  PHOTOGRAPHY = 'photography',
  WRITING = 'writing',
  TRANSLATION = 'translation',
  LEGAL = 'legal',
  ACCOUNTING = 'accounting',
  OTHER = 'other'
}

export enum GhanaRegion {
  GREATER_ACCRA = 'greater_accra',
  ASHANTI = 'ashanti',
  WESTERN = 'western',
  CENTRAL = 'central',
  VOLTA = 'volta',
  EASTERN = 'eastern',
  NORTHERN = 'northern',
  UPPER_EAST = 'upper_east',
  UPPER_WEST = 'upper_west',
  BRONG_AHAFO = 'brong_ahafo',
  WESTERN_NORTH = 'western_north',
  AHAFO = 'ahafo',
  BONO = 'bono',
  BONO_EAST = 'bono_east',
  OTI = 'oti',
  SAVANNAH = 'savannah',
  NORTH_EAST = 'north_east'
}

@Entity('jobs')
@Index(['category', 'region', 'status']) // Composite index for common queries
@Index(['created_at'])
@Index(['budget_min', 'budget_max'])
@Index(['region', 'city'])
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  client_id: string;

  @Column({ type: 'text' })
  @Index('IDX_job_title_search') // For text search
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Enhanced location structure
  @Column({
    type: 'enum',
    enum: GhanaRegion
  })
  @Index()
  region: GhanaRegion;

  @Column({ type: 'text' })
  @Index()
  city: string;

  @Column({ type: 'text', nullable: true })
  specific_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  // Category fields
  @Column({
    type: 'enum',
    enum: JobCategory
  })
  @Index()
  category: JobCategory;

  @Column({ type: 'text', nullable: true })
  subcategory: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Index()
  budget_min: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Index()
  budget_max: number;

  @Column({ type: 'text', array: true, nullable: true })
  required_skills: string[];

  @Column({
    type: 'enum',
    enum: JobUrgency
  })
  @Index()
  urgency: JobUrgency;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'text', nullable: true })
  estimated_duration: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN
  })
  @Index()
  status: JobStatus;

  @Column({ type: 'int', default: 0 })
  views_count: number;

  @Column({ type: 'int', default: 0 })
  applications_count: number;

  @Column({
    type: 'enum',
    enum: JobCurrentStatus,
    default: JobCurrentStatus.OPEN
  })
  current_status: JobCurrentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  actual_start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  actual_completion_date: Date;

  @Column({ type: 'uuid', nullable: true })
  selected_worker_id: string;

  @Column({ type: 'jsonb', default: [] })
  milestone_updates: any[];

  // Enhanced availability and distance preferences
  @Column({ 
    type: 'jsonb',
    default: {
      immediate: false,
      flexible_timing: true,
      specific_times: []
    }
  })
  availability_requirement: {
    immediate: boolean;
    flexible_timing: boolean;
    specific_times: string[];
  };

  @Column({
    type: 'jsonb',
    default: {
      max_distance_km: null,
      travel_compensation: false
    }
  })
  distance_preference: {
    max_distance_km?: number;
    travel_compensation: boolean;
  };

  // Metadata for search optimization
  @Column({ type: 'tsvector', nullable: true })
  @Index('IDX_job_search_vector', { synchronize: false }) // Full-text search index
  search_vector: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    tags?: string[];
    priority_score?: number;
    estimated_applicants?: number;
    market_rate_analysis?: {
      suggested_min: number;
      suggested_max: number;
      confidence: number;
    };
  };

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, user => user.jobs)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'selected_worker_id' })
  selectedWorker: User;

  // @OneToMany(() => JobApplication, proposal => proposal.job)
  // proposals: JobApplication[];

  @OneToMany(() => JobApplication, application => application.job)
  applications: JobApplication[];

  @OneToMany(() => Booking, booking => booking.job)
  booking: Booking[];

  // Virtual computed properties (would be implemented in service layer)
  distance_from_user?: number; // Calculated based on user location
  client_rating?: number; // From client's profile
  client_total_jobs?: number; // From client's job history
  matching_score?: number; // Algorithm-based relevance score
}
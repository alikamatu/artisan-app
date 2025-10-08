// entities/job-application.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';
import { Booking } from './booking.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

@Entity('job_applications')
@Index(['job_id', 'worker_id'], { unique: true }) // Prevent duplicate applications
@Index(['job_id', 'status'])
@Index(['worker_id', 'status'])
@Index(['created_at'])
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  job_id: string;

  @Column('uuid')
  worker_id: string;

  @Column({ type: 'text' })
  cover_letter: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  proposed_budget: number;

  @Column({ type: 'text' })
  estimated_completion_time: string;

  @Column({ type: 'date', nullable: true })
  completion_date: Date | null;

  @Column({ type: 'date' })
  availability_start_date: Date;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  // Timestamps for application workflow
  @Column({ type: 'timestamptz', nullable: true })
  accepted_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  rejected_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  withdrawn_at: Date;

  // Additional metadata
  @Column({ 
    type: 'jsonb',
    default: {}
  })
  metadata: {
    application_source?: 'web' | 'mobile' | 'api';
    worker_portfolio_links?: string[];
    additional_notes?: string;
    estimated_hours?: number;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Job, job => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, user => user.workerApplications)
  @JoinColumn({ name: 'worker_id' })
  worker: User;

  @OneToOne(() => Booking, booking => booking.application)
  booking: Booking;
}
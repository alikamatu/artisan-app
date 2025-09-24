import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';
import { JobApplication } from './job-application.entity';
import { Review } from './review.entity';

export enum BookingStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

@Entity('bookings')
@Index(['client_id', 'status'])
@Index(['worker_id', 'status'])
@Index(['start_date'])
@Index(['expected_completion_date'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  application_id: string;

  @Column('uuid')
  job_id: string;

  @Column('uuid')
  client_id: string;

  @Column('uuid')
  worker_id: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.ACTIVE
  })
  status: BookingStatus;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  expected_completion_date: Date;

  @Column({ type: 'date', nullable: true })
  actual_completion_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_budget: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ 
    type: 'jsonb',
    nullable: true,
    default: () => "'[]'"
  })
  completion_proof: any[];

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string;

  // Workflow timestamps
  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelled_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @OneToOne(() => JobApplication, application => application.booking)
  @JoinColumn({ name: 'application_id' })
  application: JobApplication;

  @ManyToOne(() => Job, job => job.bookings)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, user => user.clientBookings)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, user => user.workerBookings)
  @JoinColumn({ name: 'worker_id' })
  worker: User;

  @OneToOne(() => Review, review => review.booking)
  review: Review;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Job } from './job.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { JobApplication } from './job-application.entity';
import { PortfolioItem } from './portfolio.entity';

export enum UserRole {
  CLIENT = 'client',
  WORKER = 'worker',
  ADMIN = 'admin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'enum', 
    enum: ['client', 'worker', 'admin'],
    default: null,
    nullable: true
  })
  role: string;

  @Column({ unique: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true })
  verification_token_expires_at: Date;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: true })
  reset_token: string;


  @Column()
  name: string;

  @Column({ nullable: true })
  region: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  reset_token_expiry: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'verification_level', default: 0 })
  verificationLevel: number;

  @Column({ nullable: true })
  verified_at: Date;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Job, job => job.client)
  jobs: Job[];

  @OneToMany(() => JobApplication, application => application.worker)
  workerApplications: JobApplication[];

  @OneToMany(() => PortfolioItem, portfolioItem => portfolioItem.worker)
  portfolioItems: PortfolioItem[];

@OneToMany(() => Booking, booking => booking.client)
client: Booking[];

@OneToMany(() => Booking, booking => booking.client)
clientBookings: Booking[];

@OneToMany(() => Booking, booking => booking.worker)
workerBookings: Booking[];

@OneToMany(() => Review, review => review.reviewer)
reviewsGiven: Review[];

@OneToMany(() => Review, review => review.reviewee)
reviewsReceived: Review[];
}
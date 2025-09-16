import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, Index } from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';
import { Review } from './review.entity';
import { JobApplication } from './job-application.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.clientBookings)
  client: User;

  @ManyToOne(() => User, user => user.workerBookings)
  worker: User;

  @Column({ name: 'schedule_start' })
  @Index()
  scheduleStart: Date;

  @Column({ name: 'schedule_end' })
  @Index()
  scheduleEnd: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @ManyToOne(() => Job, job => job.booking)
  job: Job;

  @Column('numeric', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column('uuid', { name: 'escrow_id', nullable: true })
  escrowId: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relations
  @OneToOne(() => JobApplication, application => application.booking)
  application: JobApplication;

  @OneToMany(() => Review, review => review.booking)
  reviews: Review[];
}
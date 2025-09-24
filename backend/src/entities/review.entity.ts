import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

export interface ReviewCategory {
  category: string;
  rating: number;
}

@Entity('reviews')
@Index(['reviewee_id', 'is_public'])
@Index(['reviewer_id'])
@Index(['rating'])
@Index(['created_at'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  booking_id: string;

  @Column('uuid')
  reviewer_id: string;

  @Column('uuid')
  reviewee_id: string;

  @Column({ 
    type: 'integer',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10)
    }
  })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ 
    type: 'jsonb',
    default: () => "'[]'"
  })
  categories: ReviewCategory[];

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  // Moderation fields
  @Column({ type: 'boolean', default: false })
  is_flagged: boolean;

  @Column({ type: 'text', nullable: true })
  moderation_notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @OneToOne(() => Booking, booking => booking.review)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => User, user => user.reviewsGiven)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User, user => user.reviewsReceived)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: User;
}

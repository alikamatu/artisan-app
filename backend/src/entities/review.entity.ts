import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.reviewsGiven)
  reviewer: User;

  @ManyToOne(() => User, user => user.reviewsReceived)
  subject: User;

  @ManyToOne(() => Booking, booking => booking.reviews)
  booking: Booking;

  @Column('int')
  rating: number;

  @Column('jsonb', { name: 'category_ratings' })
  categoryRatings: Record<string, number>;

  @Column('text')
  text: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { Point } from 'geojson';
import { User } from './user.entity';

@Entity('worker_profiles')
export class WorkerProfile {
  @PrimaryColumn('uuid')
  userId: string;

  @Column()
  headline: string;

  @Column('text')
  bio: string;

  @Column('jsonb')
  skills: string[];

  @Column('geography', {
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  @Index({ spatial: true })
  serviceAreas: Point;

  @Column('jsonb')
  portfolio: Array<{
    url: string;
    title: string;
    description: string;
    type: 'image' | 'video';
  }>;

  @Column('jsonb')
  pricing: Record<string, number>;

  @Column('jsonb')
  availability: Record<string, boolean[]>;

  @Column('numeric', { precision: 3, scale: 2, nullable: true })
  avgRating: number;

  @Column({ nullable: true })
  ratingCount: number;

  // Relations
  @OneToOne(() => User, user => user.workerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
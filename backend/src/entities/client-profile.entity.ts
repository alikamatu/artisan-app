// src/entities/client-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('client_profile')
export class ClientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ nullable: true })
  company: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column('jsonb', { nullable: true })
  payment_methods: {
    primary: {
      type: string;
      last4?: string;
      cardholderName?: string;
      expiryDate?: string;
    };
    billing_address: string;
  };

  @Column('jsonb', { nullable: true })
  preferences: {
    categories: string[];
    budget_range: [number, number];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  @Column('jsonb', { nullable: true })
  address_details: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @Column({ default: false })
  onboarding_completed: boolean;

  @Column('jsonb', { nullable: true })
  onboarding_progress: {
    profile: boolean;
    payment: boolean;
    preferences: boolean;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
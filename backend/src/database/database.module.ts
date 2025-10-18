import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { JobApplication } from 'src/entities/job-application.entity';
import { Job } from 'src/entities/job.entity';
import { PortfolioItem } from 'src/entities/portfolio.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DB_URL'),
        entities: [User, Booking, Job, JobApplication, Review, PortfolioItem],
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: process.env.NODE_ENV === 'production',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
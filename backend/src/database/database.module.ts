import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { JobApplication } from 'src/entities/job-application.entity';
import { Job } from 'src/entities/job.entity';
import { Message } from 'src/entities/message.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { WorkerProfile } from 'src/entities/worker-profile.entity';
import { AdminVerification } from 'src/entities/admin-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DB_URL');
        
        // Parse the URL to add SSL parameters
        const url = new URL(databaseUrl);
        url.searchParams.set('sslmode', 'require');
        url.searchParams.set('sslcert', '');
        url.searchParams.set('sslkey', '');
        url.searchParams.set('sslrootcert', '');
        
        return {
          type: 'postgres',
          url: url.toString(),
          entities: [User, Booking, WorkerProfile, Job, JobApplication, Review, Message, AdminVerification],
          synchronize: false,
          ssl: {
            rejectUnauthorized: false,
            requestCert: false,
            agent: false,
          },
          extra: {
            ssl: {
              rejectUnauthorized: false,
              requestCert: false,
              agent: false,
            },
          },
          // Add connection timeout and retry settings
          connectTimeoutMS: 60000,
          acquireTimeoutMS: 60000,
          timeout: 60000,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
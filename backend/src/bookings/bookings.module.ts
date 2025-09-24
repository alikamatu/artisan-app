import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ApplicationsModule } from '../applications/applications.module';
import { JobsModule } from '../jobs/jobs.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [
    SupabaseModule,
    ApplicationsModule,
    JobsModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService, SupabaseService],
  exports: [BookingsService, SupabaseService]
})
export class BookingsModule {}
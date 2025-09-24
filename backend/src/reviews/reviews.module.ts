import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { BookingsModule } from '../bookings/bookings.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [
    SupabaseModule,
    BookingsModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, SupabaseService],
  exports: [ReviewsService, SupabaseService]
})
export class ReviewsModule {}
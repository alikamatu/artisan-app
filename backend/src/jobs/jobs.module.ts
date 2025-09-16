import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [SupabaseModule],
  controllers: [JobsController],
  providers: [JobsService, SupabaseService],
  exports: [JobsService]
})
export class JobsModule {}
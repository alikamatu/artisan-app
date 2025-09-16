import { Module } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { SupabaseModule } from "src/supabase/supabase.module";
import { SupabaseService } from "src/supabase/supabase.service";
import { JobsService } from "src/jobs/jobs.service";

@Module({
  imports: [SupabaseModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, SupabaseService, JobsService],
  exports: [ApplicationsService]
})

export class ApplicationsModule {}
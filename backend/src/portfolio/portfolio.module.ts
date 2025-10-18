import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, CloudinaryService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
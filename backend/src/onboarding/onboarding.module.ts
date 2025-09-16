import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [
    SupabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h', // or whatever your auth module uses
      },
    }),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, CloudinaryService, JwtStrategy, SupabaseService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
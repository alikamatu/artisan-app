// src/auth/strategies/jwt.strategy.ts - Enhanced with debugging
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly supabase: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    
    // Debug log to ensure strategy is initialized
    console.log('JwtStrategy initialized with secret:', process.env.JWT_SECRET ? 'Present' : 'Missing');
  }

  async validate(payload: any) {
    try {
      console.log('=== JWT STRATEGY VALIDATE ===');
      console.log('JWT Payload:', {
        sub: payload.sub,
        email: payload.email,
        exp: new Date(payload.exp * 1000).toISOString(),
      });

      // Validate that the payload has required fields
      if (!payload.sub || !payload.email) {
        console.log('ERROR: Invalid JWT payload - missing sub or email');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Fetch user from database to ensure they still exist and are active
      const { data: user, error } = await this.supabase
        .client
        .from('user')
        .select('id, email, name, is_verified, role')
        .eq('id', payload.sub)
        .single();

      if (error || !user) {
        console.log('ERROR: User not found in database:', error?.message);
        throw new UnauthorizedException('User not found');
      }

      if (!user.is_verified) {
        console.log('ERROR: User email not verified');
        throw new UnauthorizedException('Email not verified');
      }

      console.log('JWT validation successful for user:', {
        id: user.id,
        email: user.email,
        verified: user.is_verified,
      });

      // Return user object that will be attached to request
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        is_verified: user.is_verified,
        role: user.role,
      };
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException(error.message || 'Token validation failed');
    }
  }
}
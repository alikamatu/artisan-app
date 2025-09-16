import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    // Use SERVICE_ROLE_KEY instead of ANON_KEY for server-side operations
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
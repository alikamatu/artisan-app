import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (config: ConfigService) => {
        const supabaseUrl = config.get<string>('SUPABASE_URL');
        const supabaseKey = config.get<string>('SUPABASE_KEY');
        
        if (!supabaseUrl) {
          throw new Error('SUPABASE_URL environment variable is required. Please set it in your .env file or environment variables.');
        }
        
        if (!supabaseKey) {
          throw new Error('SUPABASE_KEY environment variable is required. Please set it in your .env file or environment variables.');
        }
        
        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule implements OnModuleInit {
  onModuleInit() {
    console.log('Supabase module initialized');
  }
}

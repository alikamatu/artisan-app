import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Request } from 'express';

@Injectable()
export class RlsService {
  async setRLSContext(
    request: Request,
    supabaseClient: any,
    userId: string
  ): Promise<void> {
    const token = request.headers.authorization?.split(' ')[1];
    
    if (token) {
      await supabaseClient.auth.setAuth(token);
    } else if (userId) {
      await supabaseClient
        .from('user_tokens')
        .select('token')
        .eq('user_id', userId)
        .single()
        .then(({ data }) => {
          if (data) supabaseClient.auth.setAuth(data.token);
        });
    }
  }
}
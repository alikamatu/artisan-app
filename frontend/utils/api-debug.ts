// utils/api-debug.ts

export const debugApi = {
  // Log API request details
  logRequest: (url: string, options: RequestInit) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 API Request');
      console.log('URL:', url);
      console.log('Method:', options.method || 'GET');
      console.log('Headers:', options.headers);
      if (options.body) {
        try {
          console.log('Body:', JSON.parse(options.body as string));
        } catch {
          console.log('Body:', options.body);
        }
      }
      console.groupEnd();
    }
  },

  // Log API response details
  logResponse: (url: string, response: Response, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`${response.ok ? '✅' : '❌'} API Response`);
      console.log('URL:', url);
      console.log('Status:', response.status, response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      if (data) {
        console.log('Data:', data);
      }
      console.groupEnd();
    }
  },

  // Log API error details
  logError: (url: string, error: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('💥 API Error');
      console.log('URL:', url);
      console.log('Error:', error);
      console.log('Message:', error.message);
      console.log('Stack:', error.stack);
      console.groupEnd();
    }
  },

  // Test API connection
  testConnection: async (baseUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`API Health Check: ${response.ok ? 'PASSED' : 'FAILED'}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      return response.ok;
    } catch (error) {
      console.error('API Health Check: FAILED');
      console.error('Error:', error);
      return false;
    }
  }
};

// Enhanced fetch wrapper with debugging
export const debugFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  debugApi.logRequest(url, options);
  
  try {
    const response = await fetch(url, options);
    
    // Try to parse response data for logging
    let data;
    try {
      const clonedResponse = response.clone();
      data = await clonedResponse.json();
    } catch {
      // Response isn't JSON, that's okay
    }
    
    debugApi.logResponse(url, response, data);
    
    return response;
  } catch (error) {
    debugApi.logError(url, error);
    throw error;
  }
};
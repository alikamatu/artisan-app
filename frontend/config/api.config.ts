export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  endpoints: {
    
    // Jobs
    jobs: '/jobs',
    jobsCreate: '/jobs/create',
    jobsMyJobs: '/jobs/client/my-jobs',
    jobsAdmin: '/jobs/admin/all',
    
    // Applications (NEW)
    applications: '/applications',
    applicationsMyApplications: '/applications/my-applications',
    applicationsJobApplications: '/applications/job',
    applicationsCheck: '/applications/check',
    applicationsWithdraw: '/applications/:id/withdraw',
    applicationsAccept: '/applications/:id/accept',
    applicationsReject: '/applications/:id/reject',
    applicationsAdmin: '/applications/admin/all',
    
    // Users
    users: '/users',
    
    // Other endpoints...
  }
} as const;

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
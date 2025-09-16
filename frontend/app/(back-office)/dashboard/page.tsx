"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
} from 'lucide-react';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  totalViews: number;
}

interface RecentJob {
  id: string;
  title: string;
  location: string;
  budget_min: number;
  budget_max: number;
  urgency: string;
  status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/sign-in');
        return;
      }

      // Get current user
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      setCurrentUser(userData);

      // Load appropriate dashboard data based on user role
      if (userData.role === 'client') {
        await loadClientDashboard(token);
      } else if (userData.role === 'worker') {
        await loadWorkerDashboard(token);
      }
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadClientDashboard = async (token: string) => {
    try {
      // Get client's jobs
      const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/client/my-jobs?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setRecentJobs(jobsData.jobs || []);

        // Calculate stats from jobs
        const jobs = jobsData.jobs || [];
        const stats: DashboardStats = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job: any) => job.status === 'open' || job.status === 'in_progress').length,
          completedJobs: jobs.filter((job: any) => job.status === 'completed').length,
          totalEarnings: 0, // This would come from completed transactions
          averageRating: 4.2, // This would come from reviews
          totalViews: jobs.reduce((sum: number, job: any) => sum + (job.views_count || 0), 0)
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Failed to load client dashboard:', error);
    }
  };

  const loadWorkerDashboard = async (token: string) => {
    try {
      // Get recent jobs for workers to browse
      const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?limit=5&status=open`);

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setRecentJobs(jobsData.jobs || []);

        // Worker stats would come from their applications and completed work
        const stats: DashboardStats = {
          totalJobs: 0, // Applied jobs
          activeJobs: 0, // Active contracts
          completedJobs: 0, // Completed work
          totalEarnings: 0,
          averageRating: 4.5,
          totalViews: 0
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Failed to load worker dashboard:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      urgent: 'text-red-600 bg-red-50'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'text-green-600 bg-green-100',
      in_progress: 'text-blue-600 bg-blue-100',
      completed: 'text-gray-600 bg-gray-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600">
            {currentUser.role === 'client' 
              ? 'Manage your job postings and find the right professionals'
              : 'Discover new opportunities and grow your career'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentUser.role === 'client' ? (
              <>
                <button
                  onClick={() => router.push('/dashboard/jobs/create-job')}
                  className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-medium">Post New Job</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/jobs/my-jobs')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">My Jobs</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/jobs/applications')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Applications</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/dashboard/jobs')}
                  className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">Browse Jobs</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/my-applications')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">My Applications</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/contracts')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Active Contracts</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Star className="h-5 w-5" />
                  <span className="font-medium">My Profile</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">GHS {stats.totalEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Jobs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentUser.role === 'client' ? 'Recent Jobs' : 'Available Opportunities'}
            </h2>
            <button
              onClick={() => router.push(currentUser.role === 'client' ? '/jobs/my-jobs' : '/jobs')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentUser.role === 'client' ? 'No jobs posted yet' : 'No jobs available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentUser.role === 'client' 
                    ? 'Create your first job post to get started'
                    : 'Check back later for new opportunities'
                  }
                </p>
                {currentUser.role === 'client' && (
                  <button
                    onClick={() => router.push('/jobs/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post Your First Job
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                          {job.urgency}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>GHS {job.budget_min.toLocaleString()} - GHS {job.budget_max.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{job.views_count} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applications_count} applications</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(job.created_at)}</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Sections for Role-specific Content */}
        {currentUser.role === 'client' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Job &quot;Plumber needed for kitchen renovation&quot; received 3 new applications</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Contract with John Doe has been completed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New message from Sarah about &quot;Garden landscaping&quot; project</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips & Recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Results</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Write detailed job descriptions</p>
                    <p className="text-xs text-gray-500">Clear requirements attract better candidates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Set competitive budgets</p>
                    <p className="text-xs text-gray-500">Market-rate pricing gets more applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Respond quickly to applications</p>
                    <p className="text-xs text-gray-500">Fast responses improve your client rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'worker' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Add profile photo</span>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Add</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Upload portfolio</span>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Upload</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Get verified</span>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Start</button>
                </div>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Electrical Installation</h4>
                  <p className="text-xs text-gray-600 mb-2">GHS 800 - GHS 1,200 • Accra</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Electrical</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">95% match</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Home Renovation</h4>
                  <p className="text-xs text-gray-600 mb-2">GHS 2,000 - GHS 3,500 • Kumasi</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Construction</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">89% match</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/jobs')}
                className="w-full mt-4 text-blue-600 text-sm hover:text-blue-700 font-medium"
              >
                View All Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
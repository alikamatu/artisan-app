"use client"

import React, { useState, useEffect, useMemo } from 'react';
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
  User,
  Menu,
} from 'lucide-react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useMyJobs, useJobs } from '@/lib/hooks/useJob';
import { useBookings } from '@/lib/hooks/useBookings';
import { JobStatus, JobUrgency } from '@/lib/types/jobs';

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
  location: any;
  budget_min: number;
  budget_max: number;
  urgency: JobUrgency;
  status: JobStatus;
  views_count: number;
  applications_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile: currentUser, loading: userLoading } = useUserProfile();
  const { jobs: clientJobs, isLoading: jobsLoading } = useMyJobs({ limit: 5 });
  const { jobs: availableJobs, isLoading: availableJobsLoading } = useJobs({ 
    limit: 5, 
    status: 'open' as JobStatus
  });
  const { bookings, isLoading: bookingsLoading } = useBookings({ limit: 10 });

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);

  // Calculate stats based on user role and data
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'client') {
      // Client stats
      const totalJobs = clientJobs?.length || 0;
      const activeJobs = clientJobs?.filter(job => 
        job.status === 'open' || job.status === 'in_progress'
      ).length || 0;
      const completedJobs = clientJobs?.filter(job => 
        job.status === 'completed'
      ).length || 0;
      const totalViews = clientJobs?.reduce((sum, job) => 
        sum + (job.views_count || 0), 0
      ) || 0;

      setStats({
        totalJobs,
        activeJobs,
        completedJobs,
        totalEarnings: currentUser.profile?.totalEarnings || 0,
        averageRating: currentUser.averageRating || 0,
        totalViews,
      });

      setRecentJobs(clientJobs || []);
    } else if (currentUser.role === 'worker') {
      // Worker stats
      const workerBookings = bookings || [];
      const totalJobs = workerBookings.length;
      const activeJobs = workerBookings.filter(booking => 
        ['active', 'in_progress'].includes(booking.status as unknown as string)
      ).length;
      const completedJobs = workerBookings.filter(booking => 
        booking.status === 'completed'
      ).length;
      const totalEarnings = workerBookings
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + (booking.final_budget || booking.agreed_budget || 0), 0);

      setStats({
        totalJobs,
        activeJobs,
        completedJobs,
        totalEarnings,
        averageRating: currentUser.averageRating || currentUser.rating || 0,
        totalViews: currentUser.totalViews || 0,
      });

      setRecentJobs(availableJobs || []);
    }
  }, [currentUser, clientJobs, availableJobs, bookings]);

  const formatLocationDisplay = (location: any) => {
    if (!location) return 'Location not specified';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      const { city, region, specific_address, address } = location;
      
      if (specific_address) return specific_address;
      if (address) return address;
      if (city && region) {
        return `${city}, ${typeof region === 'string' ? region.split('_').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : region}`;
      }
      return city || region || 'Location not specified';
    }
    
    return 'Location not specified';
  };

  const loading = userLoading || jobsLoading || availableJobsLoading || bookingsLoading;

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      urgent: 'text-red-600 bg-red-50'
    };
    return colors[urgency] || 'text-gray-600 bg-gray-50';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'text-green-600 bg-green-100',
      in_progress: 'text-blue-600 bg-blue-100',
      completed: 'text-gray-600 bg-gray-100',
      cancelled: 'text-red-600 bg-red-100',
      pending: 'text-yellow-600 bg-yellow-100',
      active: 'text-blue-600 bg-blue-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  // Calculate profile completion percentage for workers
  const profileCompletion = useMemo(() => {
    if (currentUser?.role !== 'worker') return 0;

    let completedFields = 0;
    const totalFields = 5; // photo, skills, description, pricing, verification

    if (currentUser.profilePhoto || currentUser.profile?.profilePhoto) completedFields++;
    if (currentUser.professional?.skills?.length) completedFields++;
    if (currentUser.professional?.description) completedFields++;
    if (currentUser.pricing?.hourly_rate) completedFields++;
    if (currentUser.verification?.verification_status === 'verified') completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }, [currentUser]);

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user data</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser.name || currentUser.profile?.firstName || 'User'}!
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
                  onClick={() => router.push('/dashboard/jobs/bookings')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">Manage Bookings</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/jobs/applications')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="font-medium">Applications</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5" />
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
                  onClick={() => router.push('/dashboard/jobs/bookings')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">My Bookings</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/applications')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">My Applications</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5" />
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
                    <p className="text-sm text-gray-600">
                      {currentUser.role === 'client' ? 'Total Jobs' : 'Total Bookings'}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {currentUser.role === 'client' ? 'Total Spent' : 'Total Earnings'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      GHS {stats.totalEarnings.toLocaleString()}
                    </p>
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
              onClick={() => router.push(
                currentUser.role === 'client' ? '/dashboard/jobs/my-jobs' : '/dashboard/jobs'
              )}
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
                    onClick={() => router.push('/dashboard/jobs/create-job')}
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
                    onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
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
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{formatLocationDisplay(job.location)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>GHS {job.budget_min?.toLocaleString()} - GHS {job.budget_max?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{job.views_count || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applications_count || 0} applications</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
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
                {bookings?.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      booking.status === 'completed' ? 'bg-green-600' :
                      booking.status === 'active' ? 'bg-blue-600' :
                      'bg-orange-600'
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Booking for &quot;{booking.job?.title}&quot; - {booking.status.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.updated_at).toLocaleDateString()} at{' '}
                        {new Date(booking.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!bookings || bookings.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
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
                  <span className="text-sm font-medium text-gray-900">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                {!currentUser.profilePhoto && !currentUser.profile?.profilePhoto && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Add profile photo</span>
                    <button 
                      onClick={() => router.push('/dashboard/profile')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
                {(!currentUser.professional?.skills || currentUser.professional.skills.length === 0) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Add your skills</span>
                    <button 
                      onClick={() => router.push('/dashboard/profile?tab=professional')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
                {!currentUser.professional?.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Write a bio</span>
                    <button 
                      onClick={() => router.push('/dashboard/profile?tab=professional')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
                {!currentUser.pricing?.hourly_rate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Set your rates</span>
                    <button 
                      onClick={() => router.push('/dashboard/profile?tab=pricing')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Set
                    </button>
                  </div>
                )}
                {currentUser.verification?.verification_status !== 'verified' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Get verified</span>
                    <button 
                      onClick={() => router.push('/dashboard/profile?tab=verification')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Start
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Work</h3>
              <div className="space-y-4">
                {bookings
                  ?.filter(booking => 
                    booking.status === 'active'
                  )
                  .slice(0, 2)
                  .map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {booking.job?.title || 'Untitled Job'}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {booking.start_date ? 
                          new Date(booking.start_date).toLocaleDateString() : 
                          'Date not set'
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'active' ? 
                          'bg-green-100 text-green-800' : 
                          booking.status === 'completed' ?
                          'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-xs text-gray-600">
                          GHS {(booking.final_budget || booking.agreed_budget || 0)?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                {(!bookings || bookings.filter(b => 
                  b.status === 'active'
                ).length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No upcoming bookings
                  </p>
                )}
              </div>
              <button
                onClick={() => router.push('/dashboard/jobs/bookings')}
                className="w-full mt-4 text-blue-600 text-sm hover:text-blue-700 font-medium"
              >
                View All Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
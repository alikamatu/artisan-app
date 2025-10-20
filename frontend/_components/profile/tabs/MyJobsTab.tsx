import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, DollarSign, Users, Eye, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useMyJobs, useJobs } from '@/lib/hooks/useJob';
import Link from 'next/link';

type JobStatus = 'open' | 'active' | 'in_progress' | 'completed' | 'cancelled';

interface MyJobsTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

const MyJobsTab: React.FC<MyJobsTabProps> = ({ profile, isOwnProfile = false }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // CORRECTED: Conditional hook usage
  const jobsData = isOwnProfile 
    ? useMyJobs({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
        sort_by: 'created_at',
        sort_order: 'DESC'
      })
    : useJobs({ // Use regular useJobs with client_id filter for public profiles
        client_id: profile.id,
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
        sort_by: 'created_at',
        sort_order: 'DESC'
      });

  const { jobs, total, page, totalPages, isLoading, error, refetch } = jobsData;

  // Format job status for display
  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      open: { label: 'Open', color: 'bg-green-100 text-green-800' },
      active: { label: 'Active', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Format budget range
  const formatBudget = (min: number, max: number) => {
    return `GHS ${min.toLocaleString()} - GHS ${max.toLocaleString()}`;
  };

  // Calculate job stats
  const jobStats = {
    total: total || 0,
    open: jobs.filter(job => job.status === 'open').length,
    active: jobs.filter(job => {
      const status = job.status as JobStatus;
      return status === 'active' || status === 'in_progress';
    }).length,
    completed: jobs.filter(job => job.status === 'completed').length,
  };

  const getJobLocation = (job: any): string => {
    if (job.city) return job.city;
    if (job.region) return job.region;

    if (job.location) {
      const { city, region, specific_address } = job.location;
      const parts = [specific_address, city, region].filter(Boolean);
      return parts.join(', ');
    }

    return 'Location not specified';
  };

  if (isLoading && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                {isOwnProfile ? 'My Jobs' : `${profile.name}'s Jobs`}
              </h2>
              <p className="text-gray-600 mt-1">Loading jobs...</p>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  // Add error handling
  if (error && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                {isOwnProfile ? 'My Jobs' : `${profile.name}'s Jobs`}
              </h2>
              <p className="text-red-600 mt-1">Error loading jobs: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Jobs Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              {isOwnProfile ? 'My Jobs' : `${profile.name}'s Jobs`}
            </h2>
            <p className="text-gray-600 mt-1">
              {isOwnProfile 
                ? 'Manage and track your posted jobs' 
                : `View jobs posted by ${profile.name}`
              }
            </p>
          </div>
          
          {isOwnProfile && (
            <Link 
              href="/dashboard/jobs/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Post New Job
            </Link>
          )}
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{jobStats.total}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{jobStats.open}</div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{jobStats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{jobStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'open', 'active', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : formatStatus(status).label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <>
          <div className="space-y-4">
            {jobs.map((job) => {
              const statusInfo = formatStatus(job.status);
              
              return (
                <div key={job.id} className="bg-white rounded-lg  p-6 transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{getJobLocation(job)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatBudget(job.budget_min, job.budget_max)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {job.start_date 
                              ? new Date(job.start_date).toLocaleDateString()
                              : 'Flexible start'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{job.applications_count || 0} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{job.views_count || 0} views</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwnProfile && (
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/dashboard/jobs/${job.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    
                    <Link 
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg border p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isOwnProfile ? 'No Jobs Posted Yet' : 'No Jobs Posted'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {isOwnProfile 
              ? 'Start posting jobs to find skilled workers for your projects. Create your first job to get started.'
              : `${profile.name} hasn't posted any jobs yet.`
            }
          </p>
          {isOwnProfile && (
            <Link 
              href="/dashboard/jobs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Post Your First Job
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobsTab;
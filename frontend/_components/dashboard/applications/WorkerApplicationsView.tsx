"use client";

import React, { useState, useCallback } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  DollarSign,
  Calendar,
  User,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  MapPin,
  Briefcase,
  Star,
  Building2,
  MessageSquare,
  TrendingUp,
  Filter,
  SortDesc,
  ExternalLink
} from 'lucide-react';
import { useMyApplications, useApplicationActions } from '@/lib/hooks/useApplications';
import { ApplicationFilters, ApplicationStatus, JobApplication } from '@/lib/types/applications';
import Link from 'next/link';

const statusConfig = {
  [ApplicationStatus.PENDING]: {
    color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    icon: Clock,
    label: 'Pending Review',
    description: 'Waiting for client response'
  },
  [ApplicationStatus.ACCEPTED]: {
    color: 'text-green-700 bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Accepted',
    description: 'Congratulations! You got the job'
  },
  [ApplicationStatus.REJECTED]: {
    color: 'text-red-700 bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Not Selected',
    description: 'Application was not accepted'
  },
  [ApplicationStatus.WITHDRAWN]: {
    color: 'text-gray-700 bg-gray-100 border-gray-200',
    icon: RefreshCw,
    label: 'Withdrawn',
    description: 'You withdrew this application'
  }
};

interface WorkerApplicationsViewProps {
  initialFilters?: ApplicationFilters;
  showHeader?: boolean;
  compact?: boolean;
  maxItems?: number;
  user: any;
}

export default function WorkerApplicationsView({ 
  initialFilters = {},
  showHeader = true,
  compact = false,
  maxItems
}: WorkerApplicationsViewProps) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: maxItems || 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    ...initialFilters
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { 
    applications, 
    total, 
    page, 
    totalPages, 
    isLoading, 
    error, 
    refetch 
  } = useMyApplications(filters);

  const { 
    withdrawApplication, 
    isLoading: actionLoading,
    error: actionError,
    clearError 
  } = useApplicationActions();

  // Helper functions
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }, []);

  const formatBudget = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const getJobLocation = useCallback((job: any) => {
    if (!job?.location) return 'Location not specified';
    if (typeof job.location === 'string') return job.location;
    return `${job.location.city}, ${job.location.region}`;
  }, []);

  const calculateSuccessRate = useCallback(() => {
    if (applications.length === 0) return 0;
    const accepted = applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length;
    return Math.round((accepted / applications.length) * 100);
  }, [applications]);

  // Event handlers
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset pagination
    }));
  }, []);

  const handleWithdraw = useCallback(async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    setActionLoadingId(applicationId);
    try {
      await withdrawApplication(applicationId);
      refetch();
    } catch (error) {
      // Error handled by hook
    } finally {
      setActionLoadingId(null);
    }
  }, [withdrawApplication, refetch]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handlePagination = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  // Quick stats calculation
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
    accepted: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    rejected: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
    successRate: calculateSuccessRate()
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              My Applications
            </h2>
            <p className="text-gray-600 mt-1">
              Track your job applications and their status
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!compact && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            )}
            
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Find Jobs
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && !compact && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Date Applied</option>
                <option value="updated_at">Last Updated</option>
                <option value="proposed_budget">Budget</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={filters.sort_order || 'DESC'}
                onChange={(e) => handleFilterChange('sort_order', e.target.value as 'ASC' | 'DESC')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error States */}
      {(error || actionError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">
                {error ? 'Failed to load applications' : 'Action failed'}
              </h4>
              <p className="text-red-700 text-sm mt-1">{error || actionError}</p>
            </div>
            <button
              onClick={() => {
                if (error) refetch();
                if (actionError) clearError();
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              {error ? 'Retry' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && applications.length === 0 && (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-4">
              {filters.status 
                ? `No ${statusConfig[filters.status as ApplicationStatus]?.label.toLowerCase()} applications found.`
                : 'Start applying to jobs to see them here.'
              }
            </p>
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Applications */}
        {!isLoading && applications.length > 0 && (
          <div className="divide-y divide-gray-200">
            {applications.map((application) => {
              const config = statusConfig[application.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedItems.has(application.id);
              const isWithdrawing = actionLoadingId === application.id;

              return (
                <div key={application.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* Application Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <Link
                            href={`/dashboard/jobs/${application.job_id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                          >
                            <span className="truncate">
                              {application.job?.title || 'Job Title'}
                            </span>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Your bid: {formatBudget(application.proposed_budget)}</span>
                            </div>
                            
                            {application.job && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span>Budget: {formatBudget(application.job.budget_min)} - {formatBudget(application.job.budget_max)}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Applied {formatDate(application.created_at)}</span>
                            </div>
                            
                            {application.job && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{getJobLocation(application.job)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </div>
                      
                      {!compact && (
                        <button
                          onClick={() => toggleExpanded(application.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Cover Letter Preview */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {application.cover_letter}
                          </p>
                        </div>
                      </div>

                      {/* Application Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Completion Time
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {application.estimated_completion_time}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Available From
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {new Date(application.availability_start_date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Last Updated
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatDate(application.updated_at)}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Status
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {config.description}
                          </p>
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {application.status === ApplicationStatus.REJECTED && application.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h4 className="font-medium text-red-900 mb-1">Rejection Reason</h4>
                          <p className="text-sm text-red-700">{application.rejection_reason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <Link
                          href={`/dashboard/jobs/${application.job_id}`}
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          View Job Details
                        </Link>
                        
                        {application.status === ApplicationStatus.PENDING && (
                          <button
                            onClick={() => handleWithdraw(application.id)}
                            disabled={isWithdrawing}
                            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                          >
                            {isWithdrawing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Withdraw Application
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!compact && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * filters.limit!) + 1} to {Math.min(page * filters.limit!, total)} of {total} applications
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePagination(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 text-sm font-medium text-gray-700">
                  {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePagination(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
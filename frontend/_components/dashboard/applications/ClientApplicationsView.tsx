"use client";

import React, { useState, useCallback, useEffect } from 'react';
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
  Users,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Award,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useClientApplications, useApplicationActions } from '@/lib/hooks/useApplications';
import { ApplicationFilters, ApplicationStatus, JobApplication } from '@/lib/types/applications';
import Link from 'next/link';

const statusConfig = {
  [ApplicationStatus.PENDING]: {
    color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    icon: Clock,
    label: 'Pending Review',
    description: 'Waiting for your response'
  },
  [ApplicationStatus.ACCEPTED]: {
    color: 'text-green-700 bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Accepted',
    description: 'Application accepted'
  },
  [ApplicationStatus.REJECTED]: {
    color: 'text-red-700 bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Rejected',
    description: 'Application rejected'
  },
  [ApplicationStatus.WITHDRAWN]: {
    color: 'text-gray-700 bg-gray-100 border-gray-200',
    icon: RefreshCw,
    label: 'Withdrawn',
    description: 'Worker withdrew application'
  }
};

interface ClientApplicationsViewProps {
  initialFilters?: ApplicationFilters;
  showHeader?: boolean;
  compact?: boolean;
  maxItems?: number;
  user: any;
}

export default function ClientApplicationsView({ 
  initialFilters = {},
  showHeader = true,
  compact = false,
  maxItems,
  user
}: ClientApplicationsViewProps) {
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
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { 
    applications, 
    total, 
    page, 
    totalPages, 
    isLoading, 
    error, 
    refetch 
  } = useClientApplications(filters);

  const { 
    acceptApplication,
    rejectApplication, 
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

  const getProfilePhoto = useCallback((worker: any) => {
    if (worker?.profile_photo) return worker.profile_photo;
    if (worker?.metadata?.profile?.photo) return worker.metadata.profile.photo;
    if (worker?.parsedMetadata?.profile?.photo) return worker.parsedMetadata.profile.photo;
    return null;
  }, []);

  const getDisplayName = useCallback((worker: any) => {
    if (worker?.display_name) return worker.display_name;
    if (worker?.first_name && worker?.last_name) return `${worker.first_name} ${worker.last_name}`;
    return worker?.name || 'Unknown User';
  }, []);

  const getInitials = useCallback((worker: any) => {
    if (worker?.first_name && worker?.last_name) {
      return `${worker.first_name.charAt(0)}${worker.last_name.charAt(0)}`.toUpperCase();
    }
    if (worker?.display_name) {
      return worker.display_name.split(' ')
        .map((word: string) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (worker?.name) {
      return worker.name.split(' ')
        .map((word: string) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  }, []);

  const calculateStats = useCallback(() => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
      accepted: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
      rejected: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
      withdrawn: applications.filter(app => app.status === ApplicationStatus.WITHDRAWN).length
    };
  }, [applications]);

  // Event handlers
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset pagination
    }));
  }, []);

  const handleAccept = useCallback(async (applicationId: string) => {
    if (!confirm('Are you sure you want to accept this application? This will reject all other pending applications for this job.')) {
      return;
    }

    setActionLoadingId(applicationId);
    try {
      await acceptApplication(applicationId);
      refetch();
    } catch (error) {
      // Error handled by hook
    } finally {
      setActionLoadingId(null);
    }
  }, [acceptApplication, refetch]);

  const handleReject = useCallback(async (applicationId: string) => {
    setActionLoadingId(applicationId);
    try {
      await rejectApplication(applicationId, rejectReason.trim() || undefined);
      refetch();
      setShowRejectModal(null);
      setRejectReason('');
    } catch (error) {
      // Error handled by hook
    } finally {
      setActionLoadingId(null);
    }
  }, [rejectApplication, rejectReason, refetch]);

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

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Job Applications
            </h2>
            <p className="text-gray-600 mt-1">
              Review and manage applications for your jobs
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!compact && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            )}
            
            <Link
              href="/dashboard/jobs/create-job"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Post Job
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Withdrawn</p>
                <p className="text-2xl font-bold text-gray-600">{stats.withdrawn}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-400" />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <RefreshCw className="h-8 w-8 text-green-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && applications.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-4">
              {filters.status 
                ? `No ${statusConfig[filters.status as ApplicationStatus]?.label.toLowerCase()} applications found.`
                : 'No one has applied to your jobs yet.'
              }
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Post more jobs to attract talented workers
              </p>
              <Link
                href="/dashboard/jobs/create-job"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Post a Job
              </Link>
            </div>
          </div>
        )}

        {/* Applications */}
        {!isLoading && applications.length > 0 && (
          <div className="divide-y divide-gray-200">
            {applications.map((application) => {
              const config = statusConfig[application.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedItems.has(application.id);
              const isActioning = actionLoadingId === application.id;

              return (
                <div key={application.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* Application Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        {/* Worker Profile Photo */}
                        <div className="relative flex-shrink-0">
                          {getProfilePhoto(application.worker) ? (
                            <img
                              src={getProfilePhoto(application.worker)}
                              alt={getDisplayName(application.worker)}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white">
                                      ${getInitials(application.worker)}
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white">
                              {getInitials(application.worker)}
                            </div>
                          )}
                          {application.worker?.verification_status === 'verified' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {getDisplayName(application.worker)}
                              </h3>
                              
                              {/* Worker Stats */}
                              {application.worker && (
                                <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="font-medium">{application.worker.rating || 'No rating'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Award className="h-4 w-4 text-blue-500" />
                                    <span>{application.worker.total_jobs_completed || 0} jobs completed</span>
                                  </div>
                                  {application.worker.verification_status === 'verified' && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <UserCheck className="h-4 w-4" />
                                      <span className="font-medium">Verified</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>Proposed: {formatBudget(application.proposed_budget)}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Duration: {application.estimated_completion_time}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Applied {formatDate(application.created_at)}</span>
                                </div>

                                {application.job && (
                                  <Link
                                    href={`/dashboard/jobs/${application.job_id}`}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                                  >
                                    <Briefcase className="h-3 w-3" />
                                    <span>{application.job.title}</span>
                                  </Link>
                                )}
                              </div>
                            </div>
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
                      {/* Cover Letter */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Cover Letter
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {application.cover_letter}
                          </p>
                        </div>
                      </div>

                      {/* Worker Skills */}
                      {application.worker?.skills && application.worker.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {application.worker.skills.slice(0, 8).map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.worker.skills.length > 8 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                +{application.worker.skills.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Application Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                            Proposed Budget
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {formatBudget(application.proposed_budget)}
                          </p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                            Can Start
                          </p>
                          <p className="text-lg font-bold text-green-900">
                            {new Date(application.availability_start_date).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                          <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                            Completion Time
                          </p>
                          <p className="text-lg font-bold text-purple-900">
                            {application.estimated_completion_time}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            Last Updated
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatDate(application.updated_at)}
                          </p>
                        </div>
                      </div>

                      {/* Worker Location */}
                      {application.worker?.location && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-gray-600" />
                            <p className="text-sm font-medium text-gray-700">Location</p>
                          </div>
                          <p className="text-gray-900">
                            {application.worker.location.city}, {application.worker.location.region}
                          </p>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {application.status === ApplicationStatus.REJECTED && application.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h4 className="font-medium text-red-900 mb-1">Rejection Reason</h4>
                          <p className="text-sm text-red-700">{application.rejection_reason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/workers/${application.worker_id}`}
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Profile
                          </Link>
                          
                          {application.job && (
                            <Link
                              href={`/dashboard/jobs/${application.job_id}`}
                              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Job
                            </Link>
                          )}
                        </div>
                        
                        {application.status === ApplicationStatus.PENDING && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowRejectModal(application.id)}
                              disabled={isActioning}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleAccept(application.id)}
                              disabled={isActioning}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 font-medium"
                            >
                              {isActioning ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <ThumbsUp className="h-4 w-4" />
                              )}
                              Accept Application
                            </button>
                          </div>
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Application
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this application? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Let the worker know why their application was rejected..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-400 mt-1">
                {rejectReason.length}/500 characters
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
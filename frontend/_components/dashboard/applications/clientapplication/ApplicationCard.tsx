import React from 'react';
import { 
  Clock, CheckCircle, XCircle, RefreshCw, Calendar, DollarSign, 
  Star, Award, UserCheck, Building2, ChevronDown, ChevronRight,
  MessageSquare, Briefcase, MapPin, User, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { getInitials, getProfilePhoto } from '@/helpers/job-helpers';
import { GetProfilePhoto } from '../../jobs/joblist/JobCard';
import { UserProfileLink } from '@/_components/common/UserProfileLink';

interface ApplicationCardProps {
  application: JobApplication;
  isExpanded: boolean;
  isActioning: boolean;
  selectedJobId: string | null;
  onToggleExpand: (id: string) => void;
  onAccept: (id: string) => void;
  onShowRejectModal: (id: string) => void;
  onShowBookingModal: (id: string) => void;
}

const statusConfig = {
  [ApplicationStatus.PENDING]: {
    color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    icon: Clock,
    label: 'Pending Review'
  },
  [ApplicationStatus.ACCEPTED]: {
    color: 'text-green-700 bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Accepted'
  },
  [ApplicationStatus.REJECTED]: {
    color: 'text-red-700 bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Rejected'
  },
  [ApplicationStatus.WITHDRAWN]: {
    color: 'text-gray-700 bg-gray-100 border-gray-200',
    icon: RefreshCw,
    label: 'Withdrawn'
  }
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  isExpanded,
  isActioning,
  selectedJobId,
  onToggleExpand,
  onAccept,
  onShowRejectModal,
  onShowBookingModal
}) => {
  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDisplayName = (worker: any) => {
    if (worker?.display_name) return worker.display_name;
    if (worker?.first_name && worker?.last_name) return `${worker.first_name} ${worker.last_name}`;
    return worker?.name || 'Unknown User';
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">

            <GetProfilePhoto user={application.worker} />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                  <UserProfileLink 
                    userId={application.worker?.id}  // This should be the worker's user ID
                    userName={getDisplayName(application.worker)}
                      userPhoto={application.worker?.profile_photo || getProfilePhoto(application.worker)}
                    showPhoto={false}
                  />
                  </h3>
                  {!selectedJobId && application.job && (
                    <div className="flex items-center gap-1 mb-2 text-sm text-blue-600">
                      <Building2 className="h-3 w-3" />
                      <span>{application.job.title}</span>
                    </div>
                  )}

                  {/* Worker Stats */}
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{application.worker?.rating || 'No rating'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span>{application.worker?.total_jobs_completed || 0} jobs</span>
                    </div>
                    {application.worker?.verification_status === 'verified' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <UserCheck className="h-4 w-4" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                  </div>

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
          
          <button
            onClick={() => onToggleExpand(application.id)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
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

          {/* Application Details */}
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
              <p className="text-sm font-semibold text-green-900">
                {new Date(application.availability_start_date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                Timeline
              </p>
              <p className="text-sm font-semibold text-purple-900">
                {application.estimated_completion_time}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                Last Updated
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(application.updated_at)}
              </p>
            </div>
          </div>

          {/* Actions */}
          {application.status === ApplicationStatus.PENDING && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => onShowRejectModal(application.id)}
                disabled={isActioning}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <ThumbsDown className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => onAccept(application.id)}
                disabled={isActioning}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                {isActioning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4" />
                )}
                Accept & Create Booking
              </button>
            </div>
          )}

          {application.status === ApplicationStatus.ACCEPTED && !application.booking_id && (
            <div className="flex items-center justify-end">
              <button
                onClick={() => onShowBookingModal(application.id)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                <Calendar className="h-4 w-4" />
                Create Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
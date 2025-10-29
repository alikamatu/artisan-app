import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  MapPin, 
  BadgeCheck,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Mail
} from 'lucide-react';
import { BookingCardProps } from '@/lib/types/booking-management.ts';
import { StatusBadge } from './status-badge';
import { BookingTimeline } from './booking-timeline';
import { BookingActions } from './booking-action';
import { CompletionModal } from './completion-modal';
import { CancelModal } from './cancel-modal';
import { IssueModal } from './issue-modal';

const statusConfig = {
  active: {
    color: 'text-blue-700 bg-blue-100 border-blue-200',
    icon: Clock,
    label: 'Active',
    description: 'Ready to start work'
  },
  completed: {
    color: 'text-green-700 bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Completed',
    description: 'Successfully finished'
  },
  cancelled: {
    color: 'text-red-700 bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Cancelled',
    description: 'Booking cancelled'
  },
  disputed: {
    color: 'text-orange-700 bg-orange-100 border-orange-200',
    icon: Flag,
    label: 'Disputed',
    description: 'Issue reported'
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  userRole, 
  onMarkComplete, 
  onCancel, 
  onCreateReview,
  onStartWork,
  onPauseWork,
  onReportIssue,
  onRequestPayment
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const config = statusConfig[booking.status];
  const otherUser = userRole === 'client' ? booking.worker : booking.client;

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {booking.job?.title || 'Job Title'}
              </h3>
              <StatusBadge status={booking.status} config={config} />
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{config.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {otherUser?.display_name || otherUser?.name}
                </span>
                {otherUser?.verification_status === 'verified' && (
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatBudget(booking.final_budget)}</span>
              </div>
              {booking.job?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.job.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {/* Timeline */}
        <BookingTimeline booking={booking} />

        {/* Expanded Details */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Job Description */}
            {booking.job?.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                  {booking.job.description}
                </p>
              </div>
            )}

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {userRole === 'client' ? 'Worker Details' : 'Client Details'}
                </h4>
                <UserDetails user={otherUser} />
              </div>

              {/* Skills & Ratings */}
              {userRole === 'client' && booking.worker && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Worker Stats</h4>
                  <WorkerStats worker={booking.worker} />
                </div>
              )}
            </div>

            {/* Milestone Payments */}
            {booking.milestone_payments && booking.milestone_payments.length > 0 && (
              <MilestonePayments milestones={booking.milestone_payments} />
            )}
          </div>
        )}

        {/* Actions */}
        <BookingActions
          booking={booking}
          userRole={userRole}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails(!showDetails)}
          onShowCompletion={() => setShowCompletionModal(true)}
          onShowCancel={() => setShowCancelModal(true)}
          onShowReview={() => setShowReviewModal(true)}
          onShowIssue={() => setShowIssueModal(true)}
          onStartWork={onStartWork}
          onPauseWork={onPauseWork}
          onRequestPayment={onRequestPayment}
        />
      </div>

      {/* Modals */}
      <CompletionModal
        show={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onSubmit={onMarkComplete}
        bookingId={booking.id}
        userRole={userRole}
      />

      <CancelModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={onCancel}
        bookingId={booking.id}
        userRole={userRole}
      />

      <IssueModal
        show={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        onSubmit={onReportIssue}
        bookingId={booking.id}
      />

      {/* <ReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={onCreateReview}
        bookingId={booking.id}
        worker={booking.worker}
      /> */}
    </>
  );
};

// Sub-components for BookingCard
const UserDetails: React.FC<{ user: any }> = ({ user }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-600">{user?.display_name || user?.name}</span>
    </div>
    {user?.email && (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{user.email}</span>
      </div>
    )}
  </div>
);

const WorkerStats: React.FC<{ worker: any }> = ({ worker }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Rating</span>
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm font-semibold text-gray-900">
          {worker.rating || 'N/A'}
        </span>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Jobs Completed</span>
      <span className="text-sm font-semibold text-gray-900">
        {worker.total_jobs_completed || 0}
      </span>
    </div>
    {worker.skills && worker.skills.length > 0 && (
      <div>
        <span className="text-sm text-gray-600 block mb-1">Skills</span>
        <div className="flex flex-wrap gap-1">
          {worker.skills.slice(0, 3).map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}
  </div>
);

const MilestonePayments: React.FC<{ milestones: any[] }> = ({ milestones }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Milestones</h4>
    <div className="space-y-2">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">{milestone.description}</p>
            <p className="text-sm text-gray-600">
              {new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS',
                minimumFractionDigits: 0
              }).format(milestone.amount)}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            milestone.status === 'paid' 
              ? 'bg-green-100 text-green-800'
              : milestone.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {milestone.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);
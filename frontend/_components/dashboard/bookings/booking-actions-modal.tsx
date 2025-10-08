"use client";

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle, 
  PlayCircle, 
  XCircle, 
  AlertTriangle,
  MessageCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types/booking';
import { useBookingActions } from '@/lib/hooks/useBookings';
import { useCreateReview, useCanReview } from '@/lib/hooks/useReviews';
import { RatingModal } from '@/_components/profile/private/rating-modal';

interface BookingActionsModalProps {
  booking: Booking;
  onClose: () => void;
  onActionComplete: () => void;
}

export const BookingActionsModal: React.FC<BookingActionsModalProps> = ({
  booking,
  onClose,
  onActionComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'details' | 'cancelled'>('actions');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  
  const { 
    updateBooking, 
    startWork, 
    markAsCompleted, 
    cancelBooking, 
    isLoading: bookingLoading 
  } = useBookingActions();
  
  
  const { createReview, isLoading: reviewLoading } = useCreateReview();
  const { canReview, reason: reviewReason, isLoading: eligibilityLoading } = useCanReview(booking.id);

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    try {
      console.log('Updating booking status to:', newStatus);
      await updateBooking(booking.id, { status: newStatus });
      onActionComplete();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleStartWork = async () => {
    try {
      await startWork(booking.id);
      onActionComplete();
    } catch (error) {
      console.error('Failed to start work:', error);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await markAsCompleted(booking.id);
      onActionComplete();
    } catch (error) {
      console.error('Failed to mark booking as complete:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      await cancelBooking(booking.id, cancellationReason);
      onActionComplete();
    } catch (error) {
      console.error('Failed to cancelled booking:', error);
    }
  };

  const handleRateWorker = async (rating: number, review: string, categories?: any[]) => {
    try {
      await createReview({
        booking_id: booking.id,
        rating,
        comment: review,
        categories: categories || []
      });
      setShowRatingModal(false);
      onActionComplete();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const getAvailableActions = () => {
    const actions = [];

    switch (booking.status) {

      case 'active':
        actions.push(
          {
            label: 'Mark as Complete',
            description: 'Job has been finished successfully',
            icon: CheckCircle,
            action: handleMarkComplete,
            variant: 'success',
          },
          {
            label: 'Report Issue',
            description: 'Report a problem with the work',
            icon: AlertTriangle,
            action: () => handleStatusUpdate('disputed'),
            variant: 'warning',
          },
          {
            label: 'Cancel Booking',
            description: 'Cancel this booking with a reason',
            icon: XCircle,
            action: () => setActiveTab('cancelled'),
            variant: 'danger',
          }
        );
        break;

      case 'completed':
        if (!booking.rating) {
          actions.push({
            label: 'Rate Worker',
            description: 'Share your experience and rate the worker',
            icon: Star,
            action: () => setShowRatingModal(true),
            variant: 'primary',
          });
        }
        actions.push({
          label: 'View Details',
          description: 'View complete booking information',
          icon: Calendar,
          action: () => setActiveTab('details'),
          variant: 'secondary',
        });
        break;

      case 'disputed':
        actions.push(
          {
            label: 'Resolve Issue',
            description: 'Mark the dispute as resolved',
            icon: CheckCircle,
            action: () => handleStatusUpdate('completed'),
            variant: 'success',
          },
          {
            label: 'Cancel Booking',
            description: 'Cancel this booking entirely',
            icon: XCircle,
            action: () => setActiveTab('cancelled'),
            variant: 'danger',
          }
        );
        break;

      default:
        actions.push({
          label: 'View Details',
          description: 'View complete booking information',
          icon: Calendar,
          action: () => setActiveTab('details'),
          variant: 'secondary',
        });
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Manage Booking</h3>
              <p className="text-gray-600 text-sm mt-1">{booking.job?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'actions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Actions
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              {(booking.status === 'active') && (
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'cancelled'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'actions' && (
              <div className="space-y-3">
                {availableActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={bookingLoading}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                      action.variant === 'primary'
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                        : action.variant === 'success'
                        ? 'border-green-200 bg-green-50 hover:bg-green-100'
                        : action.variant === 'warning'
                        ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                        : action.variant === 'danger'
                        ? 'border-red-200 bg-red-50 hover:bg-red-100'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className={`h-5 w-5 ${
                        action.variant === 'primary' ? 'text-blue-600' :
                        action.variant === 'success' ? 'text-green-600' :
                        action.variant === 'warning' ? 'text-yellow-600' :
                        action.variant === 'danger' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-900">{action.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                  <p className="text-gray-700">{booking.job?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Worker</p>
                    <p className="font-medium text-gray-900">{booking.worker?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">GHS {booking.agreed_budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{booking.estimated_duration}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cancelled' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Cancel Booking</h4>
                      <p className="text-red-700 text-sm mt-1">
                        This action cannot be undone. The worker will be notified of the cancellation.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation *
                  </label>
                  <textarea
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please provide a reason for cancelling this booking..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    required
                  />
                </div>

                <button
                  onClick={handleCancelBooking}
                  disabled={!cancellationReason.trim() || bookingLoading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Confirm Cancellation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          worker={booking.worker}
          jobTitle={booking.job?.title || 'Unknown Job'}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRateWorker}
          isLoading={reviewLoading}
        />
      )}
    </>
  );
};
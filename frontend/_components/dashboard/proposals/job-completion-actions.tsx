"use client";

import React, { useState } from 'react';
import { CheckCircle, Star, Calendar, Loader2, Clock, AlertCircle } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { useBookingActions } from '@/lib/hooks/useBookings';
import { useCanReview, useCreateReview } from '@/lib/hooks/useReviews';
import { RatingModal } from '@/_components/profile/private/rating-modal';

interface JobCompletionActionsProps {
  application: JobApplication;
  onStatusUpdate: () => void;
}

export const JobCompletionActions: React.FC<JobCompletionActionsProps> = ({
  application,
  onStatusUpdate
}) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { markAsCompleted, isLoading: completionLoading } = useBookingActions();
  const { createReview, isLoading: reviewLoading } = useCreateReview();
  const { canReview, reason, isLoading: eligibilityLoading } = useCanReview(
    application.booking_id!
  );

  const handleMarkComplete = async () => {
    try {
      await markAsCompleted(application.booking_id!);
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to mark job as complete:', error);
    }
  };

  const handleRateWorker = async (rating: number, review: string, categories?: any[]) => {
    try {
      await createReview({
        booking_id: application.booking_id!,
        rating,
        comment: review,
        categories: categories || []
      });
      setShowRatingModal(false);
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  // If no booking exists, show nothing
  if (!application.booking_id) {
    return null;
  }

  const booking = application.booking;
  const isCompleted = booking?.status === 'completed';
  const isRated = booking?.rating && booking.rating.overall_rating > 0;

  return (
    <div className="space-y-3">
      {/* Mark as Complete Button */}
      {!isCompleted && (
        <button
          onClick={handleMarkComplete}
          disabled={completionLoading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {completionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Mark Job as Complete
        </button>
      )}

      {/* Rating Section */}
      {isCompleted && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Rate Worker</h4>
            {isRated && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < ((booking.rating && booking.rating.overall_rating) || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {!isRated ? (
            <div className="space-y-3">
              {eligibilityLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-600 ml-2">Checking eligibility...</span>
                </div>
              ) : canReview ? (
                <button
                  onClick={() => setShowRatingModal(true)}
                  disabled={reviewLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Rate & Review Worker
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Cannot review yet</p>
                      <p className="text-sm text-yellow-700 mt-1">{reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  You've rated this worker {booking.rating?.overall_rating}/5 stars
                </span>
              </div>
              {booking.review && (
                <p className="text-sm text-green-700 mt-2">{booking.review}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Booking Status */}
      {booking && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Booking Status:</span>
          <span className={`font-medium ${
            booking.status === 'completed' ? 'text-green-600' :
            booking.status === 'in_progress' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {booking.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      )}

      {/* Completion Date */}
      {booking?.completion_date && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Completed on:</span>
          <span className="font-medium">
            {new Date(booking.completion_date).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          worker={application.worker}
          jobTitle={application.job?.title || 'Unknown Job'}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRateWorker}
          isLoading={reviewLoading}
        />
      )}
    </div>
  );
};
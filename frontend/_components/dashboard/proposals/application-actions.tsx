"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, Calendar, Loader2, Clock, Star, AlertCircle, Circle } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { useBookingActions } from '@/lib/hooks/useBookings';

interface ApplicationActionsProps {
  application: JobApplication;
  isLoading: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onShowBookingModal: (id: string) => void;
  onStatusUpdate: () => void;
}

// Booking Status Tracker Component
const BookingStatusTracker: React.FC<{ application: JobApplication }> = ({ application }) => {
  const booking = application.booking;
  
  if (!booking) return null;

  const statusSteps = [
    { 
      key: 'confirmed', 
      label: 'Booking Confirmed', 
      icon: CheckCircle,
      completed: ['confirmed', 'active', 'completed'].includes(booking.status)
    },
    { 
      key: 'active', 
      label: 'Work Started', 
      icon: Clock,
      completed: ['active', 'completed'].includes(booking.status)
    },
    { 
      key: 'completed', 
      label: 'Work Completed', 
      icon: CheckCircle,
      completed: booking.status === 'completed'
    },
    { 
      key: 'rated', 
      label: 'Rated', 
      icon: CheckCircle,
      completed: booking.status === 'completed' && booking.rating !== null
    }
  ];

  if (booking.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600" />
          <div>
            <h4 className="font-medium text-red-900">Booking Cancelled</h4>
            <p className="text-sm text-red-700 mt-1">
              This booking has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-4">Booking Progress</h4>
      <div className="space-y-3">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.completed;
          const isLast = index === statusSteps.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isActive ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-6 ${
                      isActive ? 'bg-green-300' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {booking.start_date && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Start Date:</span>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(booking.start_date).toLocaleDateString()}
              </p>
            </div>
            {application.completion_date && (
              <div>
                <span className="text-gray-600">Completed:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date(application.completion_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Rating Modal Component
const RatingModal: React.FC<{
  isOpen: boolean;
  rating: number;
  review: string;
  isSubmitting: boolean;
  onRatingChange: (rating: number) => void;
  onReviewChange: (review: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}> = ({ isOpen, rating, review, isSubmitting, onRatingChange, onReviewChange, onSubmit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Rate Worker Performance
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-medium text-gray-900">
                {rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => onReviewChange(e.target.value)}
              placeholder="Share your experience working with this person..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Job Completion Actions Component
const JobCompletionActions: React.FC<{
  application: JobApplication;
  onStatusUpdate: () => void;
}> = ({ application, onStatusUpdate }) => {
  const { markAsCompleted, isLoading, error } = useBookingActions();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const booking = application.booking;
  
  if (!booking) return null;

  const handleCompleteWork = async () => {
    try {
      await markAsCompleted(booking.id);
      onStatusUpdate();
      setShowRatingModal(true);
    } catch (err) {
      console.error('Failed to mark work as completed:', err);
    }
  };

  const handleSubmitRating = async () => {
    setIsSubmitting(true);
    setRatingError(null);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiUrl}/bookings/${booking.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          review: review.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit rating');
      }

      setShowRatingModal(false);
      setRating(5);
      setReview('');
      onStatusUpdate();
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show different UI based on booking status
  if (booking.status === 'completed' && booking.rating) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-green-900">Job Completed & Rated</h4>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (booking.rating?.overall_rating ?? 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Your rating: {booking.rating.overall_rating}/5
              </span>
            </div>
            {booking.review && (
              <p className="text-sm text-gray-700 mt-2">{booking.review}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (booking.status === 'completed' && !booking.rating) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Job Completed - Rate Worker</h4>
            <p className="text-sm text-blue-700 mt-1">
              Please rate the worker's performance
            </p>
            <button
              onClick={() => setShowRatingModal(true)}
              className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Rate Worker
            </button>
          </div>
        </div>
        
        <RatingModal
          isOpen={showRatingModal}
          rating={rating}
          review={review}
          isSubmitting={isSubmitting}
          onRatingChange={setRating}
          onReviewChange={setReview}
          onSubmit={handleSubmitRating}
          onClose={() => {
            setShowRatingModal(false);
            setRatingError(null);
          }}
        />
        
        {ratingError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{ratingError}</p>
          </div>
        )}
      </div>
    );
  }

  if (booking.status === 'active') {
    return (
      <div className="space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">Work In Progress</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Mark as complete when the work is done
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleCompleteWork}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Marking as Complete...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Mark Work as Complete
            </>
          )}
        </button>
      </div>
    );
  }

  if (booking.status === 'confirmed') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Booking Confirmed</h4>
            <p className="text-sm text-blue-700 mt-1">
              Waiting for work to start
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Main Application Actions Component
export const ApplicationActions: React.FC<ApplicationActionsProps> = ({
  application,
  isLoading,
  onAccept,
  onReject,
  onShowBookingModal,
  onStatusUpdate
}) => {
  // If application has a booking, show completion and rating actions
  if (application.booking_id) {
    return (
      <div className="space-y-4">
        <BookingStatusTracker application={application} />
        <JobCompletionActions 
          application={application} 
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    );
  }

  // Original actions for pending applications
  if (application.status !== ApplicationStatus.PENDING) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          {application.status === ApplicationStatus.ACCEPTED && 'Application accepted'}
          {application.status === ApplicationStatus.REJECTED && 'Application rejected'}
          {application.status === ApplicationStatus.WITHDRAWN && 'Application withdrawn'}
        </p>
        
        {application.status === ApplicationStatus.ACCEPTED && !application.booking_id && (
          <button
            onClick={() => onShowBookingModal(application.id)}
            className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Create Booking
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => onAccept(application.id)}
        disabled={isLoading}
        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Accept Application
      </button>
      
      <button
        onClick={() => onReject(application.id)}
        disabled={isLoading}
        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        Reject Application
      </button>
    </div>
  );
};
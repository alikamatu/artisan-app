"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, Loader2, CheckCircle } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';
import { useCreateBooking } from '@/lib/hooks/useBookings';
import { CreateBookingData } from '@/lib/types/booking';

interface BookingCreationModalProps {
  application: JobApplication;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingCreationModal: React.FC<BookingCreationModalProps> = ({
  application,
  onClose,
  onSuccess
}) => {
  const { createBooking, isLoading, error } = useCreateBooking();
  const [startDate, setStartDate] = useState(
    new Date(application.availability_start_date).toISOString().split('T')[0]
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    application.estimated_completion_time
  );

    const [bookingData, setBookingData] = useState<Partial<CreateBookingData>>({
      application_id: application.id,
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
      expected_completion_date: '',
      final_budget: application.proposed_budget,
      notes: '',
      milestone_payments: []
    });
  const handleSubmit = async () => {

    try {
      const fullBookingData: CreateBookingData = {
        application_id: application.id,
        start_date: bookingData.start_date!,
        expected_completion_date: bookingData.expected_completion_date!,
        final_budget: bookingData.final_budget!,
      };

      await createBooking(fullBookingData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Create Booking</h3>
            <p className="text-gray-600 text-sm">Schedule work with {application.worker?.display_name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Application Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Worker:</span>
                <span className="font-medium">{application.worker?.display_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Job:</span>
                <span className="font-medium text-right">{application.job?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agreed Budget:</span>
                <span className="font-medium">GHS {application.proposed_budget}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="estimatedDuration"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g., 2 weeks, 5 days, 1 month"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingCreationModal;
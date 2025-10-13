"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, Loader2, CheckCircle } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';


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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Single source of truth for form data
  const [formData, setFormData] = useState({
    start_date: new Date(application.availability_start_date).toISOString().split('T')[0],
    expected_completion_date: '',
    estimated_duration: application.estimated_completion_time,
    final_budget: application.proposed_budget,
    notes: ''
  });

  // Calculate expected completion date based on duration
  const calculateCompletionDate = (startDate: string, duration: string): string => {
    const start = new Date(startDate);
    const durationLower = duration.toLowerCase();
    
    // Parse duration (e.g., "2 weeks", "5 days", "1 month")
    let daysToAdd = 7; // default
    
    if (durationLower.includes('day')) {
      const match = durationLower.match(/(\d+)\s*day/);
      daysToAdd = match ? parseInt(match[1]) : 7;
    } else if (durationLower.includes('week')) {
      const match = durationLower.match(/(\d+)\s*week/);
      daysToAdd = match ? parseInt(match[1]) * 7 : 7;
    } else if (durationLower.includes('month')) {
      const match = durationLower.match(/(\d+)\s*month/);
      daysToAdd = match ? parseInt(match[1]) * 30 : 30;
    }
    
    start.setDate(start.getDate() + daysToAdd);
    return start.toISOString().split('T')[0];
  };

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate completion date when start date or duration changes
      if (field === 'start_date' || field === 'estimated_duration') {
        if (updated.start_date && updated.estimated_duration) {
          updated.expected_completion_date = calculateCompletionDate(
            updated.start_date,
            updated.estimated_duration
          );
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.start_date || !formData.expected_completion_date) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.expected_completion_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('Start date cannot be in the past');
      return;
    }

    if (endDate <= startDate) {
      setError('Expected completion date must be after start date');
      return;
    }

    try {
      setIsLoading(true);

      const bookingPayload = {
        application_id: application.id,
        start_date: formData.start_date,
        expected_completion_date: formData.expected_completion_date,
        final_budget: formData.final_budget,
        notes: formData.notes || undefined
      };

      const token = localStorage.getItem('access_token');

      // Replace with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Create Booking</h3>
            <p className="text-gray-600 text-sm">
              Schedule work with {application.worker?.display_name}
            </p>
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
                <span className="font-medium">GHS {formData.final_budget}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="estimatedDuration"
                  value={formData.estimated_duration}
                  onChange={(e) => updateField('estimated_duration', e.target.value)}
                  placeholder="e.g., 2 weeks, 5 days, 1 month"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Completion Date *
              </label>
              <input
                type="date"
                id="completionDate"
                value={formData.expected_completion_date}
                onChange={(e) => updateField('expected_completion_date', e.target.value)}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated based on duration, but you can adjust it
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Any additional instructions or requirements..."
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isLoading}
              />
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
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingCreationModal;
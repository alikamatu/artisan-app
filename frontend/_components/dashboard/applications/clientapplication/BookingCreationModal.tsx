"use client";

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  Star,
  Plus,
} from 'lucide-react';
import { useCreateBooking } from '@/lib/hooks/useBookings';
import { ApplicationStatus, JobApplication } from '@/lib/types/applications';
import { CreateBookingData, MilestonePayment } from '@/lib/types/booking';

interface BookingCreationModalProps {
  application: JobApplication;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingCreationModal ({
  application,
  onClose,
  onSuccess
}: BookingCreationModalProps) {
  const [bookingData, setBookingData] = useState<Partial<CreateBookingData>>({
    application_id: application.id,
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    expected_completion_date: '',
    final_budget: application.proposed_budget,
    notes: '',
    milestone_payments: []
  });
  
  const [milestones, setMilestones] = useState<Omit<MilestonePayment, 'id' | 'booking_id' | 'status' | 'paid_at'>[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createBooking, isLoading, error } = useCreateBooking();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.start_date) {
      newErrors.start_date = 'Start date is required';
    } else {
      const startDate = new Date(bookingData.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
    }

    if (!bookingData.expected_completion_date) {
      newErrors.expected_completion_date = 'Expected completion date is required';
    } else if (bookingData.start_date) {
      const startDate = new Date(bookingData.start_date);
      const completionDate = new Date(bookingData.expected_completion_date);
      
      if (completionDate <= startDate) {
        newErrors.expected_completion_date = 'Completion date must be after start date';
      }
    }

    if (!bookingData.final_budget || bookingData.final_budget <= 0) {
      newErrors.final_budget = 'Budget must be greater than 0';
    }

    // Validate milestones
    if (milestones.length > 0) {
      const totalMilestoneAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
      if (totalMilestoneAmount > (bookingData.final_budget || 0)) {
        newErrors.milestones = 'Total milestone amount cannot exceed final budget';
      }

      milestones.forEach((milestone, index) => {
        if (!milestone.description.trim()) {
          newErrors[`milestone_${index}_description`] = 'Description is required';
        }
        if (milestone.amount <= 0) {
          newErrors[`milestone_${index}_amount`] = 'Amount must be greater than 0';
        }
        if (!milestone.due_date) {
          newErrors[`milestone_${index}_due_date`] = 'Due date is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const fullBookingData: CreateBookingData = {
        application_id: application.id,
        start_date: bookingData.start_date!,
        expected_completion_date: bookingData.expected_completion_date!,
        final_budget: bookingData.final_budget!,
        notes: bookingData.notes,
        milestone_payments: milestones.length > 0 ? milestones : undefined
      };

      await createBooking(fullBookingData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const addMilestone = () => {
    const newMilestone: Omit<MilestonePayment, 'id' | 'booking_id' | 'status' | 'paid_at'> = {
      description: '',
      amount: 0,
      due_date: bookingData.expected_completion_date || ''
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (
    index: number,
    field: keyof Omit<MilestonePayment, 'id' | 'booking_id' | 'status' | 'paid_at'>,
    value: string | number
  ) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Create Job Booking
              </h3>
              <p className="text-gray-600">
                Set up the work arrangement with {application.worker?.display_name || application.worker?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Application Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Application Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Proposed Budget
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatBudget(application.proposed_budget)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Timeline
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {application.estimated_completion_time}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Available From
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(application.availability_start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Worker Rating
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <p className="text-sm font-semibold text-gray-900">
                    {application.worker?.rating || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Failed to create booking</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={bookingData.start_date?.split('T')[0] || ''}
                  onChange={(e) => setBookingData(prev => ({ ...prev, start_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && (
                  <p className="text-red-600 text-xs mt-1">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion Date *
                </label>
                <input
                  type="date"
                  value={bookingData.expected_completion_date?.split('T')[0] || ''}
                  onChange={(e) => setBookingData(prev => ({ ...prev, expected_completion_date: e.target.value }))}
                  min={bookingData.start_date?.split('T')[0] || new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.expected_completion_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.expected_completion_date && (
                  <p className="text-red-600 text-xs mt-1">{errors.expected_completion_date}</p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Budget (GHS) *
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={bookingData.final_budget || ''}
                onChange={(e) => setBookingData(prev => ({ ...prev, final_budget: parseFloat(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.final_budget ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter final agreed budget"
              />
              {errors.final_budget && (
                <p className="text-red-600 text-xs mt-1">{errors.final_budget}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Proposed budget: {formatBudget(application.proposed_budget)}
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={bookingData.notes || ''}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or requirements for this job..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={1000}
              />
              <div className="text-xs text-gray-400 mt-1">
                {bookingData.notes?.length || 0}/1000 characters
              </div>
            </div>

            {/* Milestone Payments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Milestone Payments</h4>
                  <p className="text-sm text-gray-600">Optional: Break down payments into milestones</p>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Milestone
                </button>
              </div>

              {errors.milestones && (
                <p className="text-red-600 text-sm mb-3">{errors.milestones}</p>
              )}

              {milestones.length > 0 && (
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Milestone {index + 1}</h5>
                        <button
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                            placeholder="e.g., Initial setup and planning"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors[`milestone_${index}_description`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            maxLength={200}
                          />
                          {errors[`milestone_${index}_description`] && (
                            <p className="text-red-600 text-xs mt-1">{errors[`milestone_${index}_description`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (GHS) *
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={milestone.amount || ''}
                            onChange={(e) => updateMilestone(index, 'amount', parseFloat(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors[`milestone_${index}_amount`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          {errors[`milestone_${index}_amount`] && (
                            <p className="text-red-600 text-xs mt-1">{errors[`milestone_${index}_amount`]}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Due Date *
                        </label>
                        <input
                          type="date"
                          value={milestone.due_date?.split('T')[0] || ''}
                          onChange={(e) => updateMilestone(index, 'due_date', e.target.value)}
                          min={bookingData.start_date?.split('T')[0] || new Date().toISOString().split('T')[0]}
                          max={bookingData.expected_completion_date?.split('T')[0] || ''}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors[`milestone_${index}_due_date`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`milestone_${index}_due_date`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`milestone_${index}_due_date`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Milestone Summary */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Total Milestones:</span>
                      <span className="font-semibold text-blue-900">
                        {formatBudget(milestones.reduce((sum, milestone) => sum + (milestone.amount || 0), 0))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-blue-700">Remaining:</span>
                      <span className="font-semibold text-blue-900">
                        {formatBudget((bookingData.final_budget || 0) - milestones.reduce((sum, milestone) => sum + (milestone.amount || 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

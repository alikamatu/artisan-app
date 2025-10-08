"use client";

import React, { useState } from 'react';
import { X, Send, DollarSign, Clock, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useCreateApplication } from '@/lib/hooks/useApplications';
import { JobResponse } from '@/lib/types/jobs';
import { CreateApplicationData } from '@/lib/types/applications';

interface JobApplicationModalProps {
  job: JobResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobApplicationModal({ job, isOpen, onClose, onSuccess }: JobApplicationModalProps) {
  const { createApplication, isLoading, error, clearError } = useCreateApplication();
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_budget: job.budget_min || 0,
    estimated_completion_time: '',
    completion_date: '',
    availability_start_date: new Date().toISOString().split('T')[0]
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.cover_letter.trim()) {
      return;
    }

    try {
      const applicationData: CreateApplicationData = {
        job_id: job.id,
        cover_letter: formData.cover_letter.trim(),
        proposed_budget: formData.proposed_budget,
        estimated_completion_time: formData.estimated_completion_time,
        completion_date: formData.completion_date,
        availability_start_date: formData.availability_start_date
      };

      await createApplication(applicationData);
      setShowSuccess(true);
      
      setTimeout(() => {
        onSuccess();
        onClose();
        setShowSuccess(false);
        // Reset form
        setFormData({
          cover_letter: '',
          proposed_budget: job.budget_min || 0,
          estimated_completion_time: '',
          completion_date: '',
          availability_start_date: new Date().toISOString().split('T')[0]
        });
      }, 2000);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  const formatBudget = (min: number, max: number) => {
    return `GHS ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply to Job</h2>
              <p className="text-gray-600 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              disabled={isLoading}
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Success State */}
        {showSuccess && (
          <div className="px-6 py-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Application Submitted!</h3>
                <p className="text-green-700 text-sm">Your application has been sent to the client successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Job Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">{formatBudget(job.budget_min, job.budget_max)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{job.estimated_duration || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Start:</span>
                <span className="font-medium">
                  {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Flexible'}
                </span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cover Letter *
              </label>
              <div className="relative">
                <textarea
                  value={formData.cover_letter}
                  onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                  placeholder="Tell the client why you're the perfect fit for this job. Highlight your relevant experience, skills, and approach to completing this work..."
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || showSuccess}
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {formData.cover_letter.length}/2000
                </div>
              </div>
            </div>

            {/* Proposed Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Proposed Budget (GHS) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min={job.budget_min}
                  max={job.budget_max}
                  value={formData.proposed_budget}
                  onChange={(e) => handleInputChange('proposed_budget', parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || showSuccess}
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Budget range: {formatBudget(job.budget_min, job.budget_max)}
              </p>
            </div>

            {/* Estimated Completion Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Estimated Completion Time *
              </label>
              <input
                type="text"
                value={formData.estimated_completion_time}
                onChange={(e) => handleInputChange('estimated_completion_time', e.target.value)}
                placeholder="e.g., 2-3 days, 1 week, 2 hours"
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || showSuccess}
                required
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Completion Date *
              </label>
              <input
                type="date"
                value={formData.completion_date}
                onChange={(e) => handleInputChange('completion_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || showSuccess}
                required
              />
            </div>  

            {/* Availability Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                When can you start? *
              </label>
              <input
                type="date"
                value={formData.availability_start_date}
                onChange={(e) => handleInputChange('availability_start_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || showSuccess}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Application Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={isLoading || showSuccess}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || showSuccess || !formData.cover_letter.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Applied!
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}
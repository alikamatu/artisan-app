"use client";

import React, { useState, useCallback } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  DollarSign,
  User,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Star,
  Award,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Target,
  MapPin,
  Briefcase,
  Building2
} from 'lucide-react';
import { useClientApplications, useApplicationActions } from '@/lib/hooks/useApplications';
import { useCreateBooking } from '@/lib/hooks/useBookings';
import { ApplicationStatus, JobApplication } from '@/lib/types/applications';
import { CreateBookingData, MilestonePayment } from '@/lib/types/booking';

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

const EnhancedClientApplicationsView: React.FC<{
  user: any;
  initialFilters?: any;
  showHeader?: boolean;
  compact?: boolean;
  maxItems?: number;
}> = ({ 
  user,
  initialFilters = {},
  showHeader = true,
  compact = false,
  maxItems
}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: maxItems || 10,
    sort_by: 'created_at' as const,
    sort_order: 'DESC' as const,
    ...initialFilters
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);
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

  const getDisplayName = useCallback((worker: any) => {
    if (worker?.display_name) return worker.display_name;
    if (worker?.first_name && worker?.last_name) return `${worker.first_name} ${worker.last_name}`;
    return worker?.name || 'Unknown User';
  }, []);

  const handleAccept = useCallback(async (applicationId: string) => {
    setActionLoadingId(applicationId);
    try {
      await acceptApplication(applicationId);
      refetch();
      // Show booking creation modal
      setShowBookingModal(applicationId);
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

  const handleBookingSuccess = useCallback(() => {
    setShowBookingModal(null);
    refetch(); // Refresh to show updated application status
  }, [refetch]);

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

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: typeof filters) => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePagination = (newPage: number) => {
    setFilters((prev: typeof filters) => ({ ...prev, page: newPage }));
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
    accepted: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    rejected: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
    withdrawn: applications.filter(app => app.status === ApplicationStatus.WITHDRAWN).length
  };

  const currentApplication = showBookingModal 
    ? applications.find(app => app.id === showBookingModal)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-600" />
              Job Applications
            </h2>
            <p className="text-gray-600 mt-1">
              Review applications and create job bookings
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
                <AlertCircle className="h-4 w-4" />
                Filter
              </button>
            )}
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
              <Target className="h-8 w-8 text-gray-400" />
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
                value={filters.sort_by}
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
                value={filters.sort_order}
                onChange={(e) => handleFilterChange('sort_order', e.target.value)}
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
        {isLoading && (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 text-green-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {!isLoading && applications.length === 0 && (
          <div className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-4">
              No applications match your current filters.
            </p>
          </div>
        )}

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
                        {/* Worker Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white flex-shrink-0">
                          {getDisplayName(application.worker).charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {getDisplayName(application.worker)}
                              </h3>
                              
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

                                {application.job && (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Building2 className="h-3 w-3" />
                                    <span>{application.job.title}</span>
                                  </div>
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

                      {/* Booking Status */}
                      {application.booking_id && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Booking Created
                          </h4>
                          <p className="text-sm text-blue-700">
                            This application has been converted to a booking. 
                            <a href={`/dashboard/bookings/${application.booking_id}`} className="font-medium underline ml-1">
                              View booking details
                            </a>
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                            <User className="h-4 w-4" />
                            View Profile
                          </button>
                          
                          {application.job && (
                            <button className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 transition-colors">
                              <Building2 className="h-4 w-4" />
                              View Job
                            </button>
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
                              Accept & Create Booking
                            </button>
                          </div>
                        )}

                        {application.status === ApplicationStatus.ACCEPTED && !application.booking_id && (
                          <button
                            onClick={() => setShowBookingModal(application.id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                          >
                            <Calendar className="h-4 w-4" />
                            Create Booking
                          </button>
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

      {/* Booking Creation Modal */}
      {showBookingModal && currentApplication && (
        <BookingCreationModal
          application={currentApplication}
          onClose={() => setShowBookingModal(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default EnhancedClientApplicationsView;
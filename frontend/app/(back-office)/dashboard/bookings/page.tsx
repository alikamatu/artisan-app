"use client";

import React, { useState, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  Star,
  FileText,
  Camera,
  Video,
  Eye,
  Trash2,
  Plus,
  Briefcase,
} from 'lucide-react';
import { useBookings, useBookingActions } from '@/lib/hooks/useBookings';
import { useCreateReview, useCanReview } from '@/lib/hooks/useReviews';
import { BookingStatus, Booking, CompletionProof, CreateReviewData } from '@/lib/types/booking';

interface BookingManagementProps {
  userRole: 'client' | 'worker';
  userId: string;
}

const statusConfig = {
  [BookingStatus.ACTIVE]: {
    color: 'text-blue-700 bg-blue-100 border-blue-200',
    icon: Clock,
    label: 'Active'
  },
  [BookingStatus.COMPLETED]: {
    color: 'text-green-700 bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Completed'
  },
  [BookingStatus.CANCELLED]: {
    color: 'text-red-700 bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Cancelled'
  },
  [BookingStatus.DISPUTED]: {
    color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    icon: AlertTriangle,
    label: 'Disputed'
  }
};

const BookingCard: React.FC<{ 
  booking: Booking; 
  userRole: 'client' | 'worker';
  onMarkComplete: (id: string, proof: CompletionProof[]) => Promise<void>;
  onCancel: (id: string, reason: string) => Promise<void>;
  onCreateReview: (data: CreateReviewData) => Promise<void>;
}> = ({ 
  booking, 
  userRole, 
  onMarkComplete, 
  onCancel, 
  onCreateReview 
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [completionProof, setCompletionProof] = useState<CompletionProof[]>([]);
  const [cancelReason, setCancelReason] = useState('');
  const [reviewData, setReviewData] = useState<Partial<CreateReviewData>>({
    rating: 5,
    comment: '',
    categories: [],
    is_public: true
  });
  
  const { canReview } = useCanReview(booking.id);
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleMarkComplete = async () => {
    try {
      await onMarkComplete(booking.id, completionProof);
      setShowCompletionModal(false);
      setCompletionProof([]);
    } catch (error) {
      console.error('Failed to mark booking as complete:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await onCancel(booking.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleCreateReview = async () => {
    try {
      const fullReviewData: CreateReviewData = {
        booking_id: booking.id,
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        categories: reviewData.categories || [],
        is_public: reviewData.is_public ?? true
      };
      await onCreateReview(fullReviewData);
      setShowReviewModal(false);
      setReviewData({
        rating: 5,
        comment: '',
        categories: [],
        is_public: true
      });
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const addCompletionProof = () => {
    const newProof: CompletionProof = {
      id: Date.now().toString(),
      booking_id: booking.id,
      type: 'text',
      description: '',
      uploaded_at: new Date().toISOString()
    };
    setCompletionProof([...completionProof, newProof]);
  };

  const updateCompletionProof = (index: number, field: keyof CompletionProof, value: string) => {
    const updated = [...completionProof];
    updated[index] = { ...updated[index], [field]: value };
    setCompletionProof(updated);
  };

  const removeCompletionProof = (index: number) => {
    setCompletionProof(completionProof.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.job?.title || 'Job Title'}
            </h3>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>
                {userRole === 'client' 
                  ? `Worker: ${booking.worker?.display_name || booking.worker?.name}`
                  : `Client: ${booking.client?.display_name || booking.client?.name}`
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{formatBudget(booking.final_budget)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Start Date
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(booking.start_date)}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Expected Completion
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(booking.expected_completion_date)}
          </p>
        </div>
        
        {booking.actual_completion_date && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
              Completed On
            </p>
            <p className="text-sm font-semibold text-green-900">
              {formatDate(booking.actual_completion_date)}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {booking.notes}
          </p>
        </div>
      )}

      {/* Completion Proof */}
      {booking.completion_proof && booking.completion_proof.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Completion Evidence:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {booking.completion_proof.map((proof, index) => (
              <div key={proof.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {proof.type === 'image' && <Camera className="h-3 w-3 text-blue-500" />}
                  {proof.type === 'video' && <Video className="h-3 w-3 text-purple-500" />}
                  {proof.type === 'document' && <FileText className="h-3 w-3 text-green-500" />}
                  {proof.type === 'text' && <MessageSquare className="h-3 w-3 text-gray-500" />}
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {proof.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {proof.description}
                </p>
                {proof.url && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View Details
          </button>
          
          {booking.job && (
            <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              View Job
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Client Actions */}
          {userRole === 'client' && booking.status === BookingStatus.ACTIVE && (
            <>
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCompletionModal(true)}
                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            </>
          )}

          {/* Review Action */}
          {userRole === 'client' && booking.status === BookingStatus.COMPLETED && canReview && !booking.review && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              Write Review
            </button>
          )}

          {/* Show existing review */}
          {booking.review && (
            <div className="text-sm text-green-600 flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Reviewed ({booking.review.rating}/5)
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mark Job as Complete
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Please provide evidence that the job has been completed satisfactorily.
                </p>
                
                <div className="space-y-3">
                  {completionProof.map((proof, index) => (
                    <div key={proof.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <select
                          value={proof.type}
                          onChange={(e) => updateCompletionProof(index, 'type', e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="text">Text Description</option>
                          <option value="image">Image</option>
                          <option value="document">Document</option>
                          <option value="video">Video</option>
                        </select>
                        <button
                          onClick={() => removeCompletionProof(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <textarea
                        value={proof.description}
                        onChange={(e) => updateCompletionProof(index, 'description', e.target.value)}
                        placeholder="Describe the completed work..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                      />
                      
                      {proof.type !== 'text' && (
                        <div className="mt-2">
                          <input
                            type="file"
                            accept={proof.type === 'image' ? 'image/*' : proof.type === 'video' ? 'video/*' : '*/*'}
                            className="text-sm"
                            onChange={(e) => {
                              // Handle file upload
                              console.log('File selected:', e.target.files?.[0]);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={addCompletionProof}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Evidence
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkComplete}
                  disabled={completionProof.length === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you're canceling..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Write Review
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`p-1 ${
                        star <= (reviewData.rating || 5)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this worker..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reviewData.is_public}
                    onChange={(e) => setReviewData(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Make this review public
                  </span>
                </label>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReview}
                  disabled={!reviewData.comment?.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingManagement: React.FC<BookingManagementProps> = ({ userRole, userId }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined as BookingStatus | undefined,
    sort_by: 'created_at' as const,
    sort_order: 'DESC' as const
  });
  const [showFilters, setShowFilters] = useState(false);

  const { 
    bookings, 
    total, 
    page, 
    totalPages, 
    isLoading, 
    error, 
    refetch 
  } = useBookings(filters);

  const { markAsCompleted, cancelBooking } = useBookingActions();
  const { createReview } = useCreateReview();

  const handleMarkComplete = useCallback(async (id: string, proof: CompletionProof[]) => {
    await markAsCompleted(id, proof);
    refetch();
  }, [markAsCompleted, refetch]);

  const handleCancel = useCallback(async (id: string, reason: string) => {
    await cancelBooking(id, reason);
    refetch();
  }, [cancelBooking, refetch]);

  const handleCreateReview = useCallback(async (data: CreateReviewData) => {
    await createReview(data);
    refetch();
  }, [createReview, refetch]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePagination = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === BookingStatus.ACTIVE).length,
    completed: bookings.filter(b => b.status === BookingStatus.COMPLETED).length,
    cancelled: bookings.filter(b => b.status === BookingStatus.CANCELLED).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            {userRole === 'client' ? 'My Bookings' : 'My Work'}
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'client' 
              ? 'Manage your active and completed job bookings'
              : 'Track your ongoing and completed work assignments'
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
            showFilters 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
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
                <option value="created_at">Date Created</option>
                <option value="start_date">Start Date</option>
                <option value="expected_completion_date">Completion Date</option>
                <option value="final_budget">Budget</option>
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Failed to load bookings</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {userRole === 'client' 
                ? "You haven't booked any workers yet."
                : "You don't have any active work assignments."
              }
            </p>
          </div>
        )}

        {!isLoading && bookings.length > 0 && bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            userRole={userRole}
            onMarkComplete={handleMarkComplete}
            onCancel={handleCancel}
            onCreateReview={handleCreateReview}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * filters.limit) + 1} to {Math.min(page * filters.limit, total)} of {total} bookings
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
      )}
    </div>
  );
};

export default BookingManagement;
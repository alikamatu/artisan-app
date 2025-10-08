"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { useBookings, useBookingActions } from '@/lib/hooks/useBookings';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { BookingManagementProps, BookingFilters, BookingStats } from '@/lib/types/booking-management.ts';
import { BookingStats as StatsComponent } from './booking-stats-worker';
import { BookingFilters as FiltersComponent } from './booking-worker-filter';
import { BookingCard } from './booking-card-worker';
import { BookingPagination } from './booking-pagination';
import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';

export const BookingManagement: React.FC<BookingManagementProps> = ({ userRole, userId }) => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    bookings, 
    total, 
    page, 
    totalPages, 
    isLoading, 
    error, 
    refetch 
  } = useBookings(filters);

  const { markAsCompleted, cancelBooking, updateBooking } = useBookingActions();
  const { createReview } = useCreateReview();

  // Memoized stats calculation
  const stats = useMemo((): BookingStats => ({
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    disputed: bookings.filter(b => b.status === 'disputed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + (booking.final_budget || 0), 0),
    avgRating: userRole === 'worker' ? 
      bookings
        .filter(b => b.review)
        .reduce((sum, booking) => sum + (booking.review?.rating || 0), 0) / 
      (bookings.filter(b => b.review).length || 1) : 0
  }), [bookings, userRole]);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => 
    bookings.filter(booking =>
      searchQuery === '' ||
      booking.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userRole === 'client' 
        ? booking.worker?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : booking.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ), [bookings, searchQuery, userRole]
  );

  // Event handlers
  const handleMarkComplete = useCallback(async (id: string, proof: any[]) => {
    await markAsCompleted(id, proof);
    refetch();
  }, [markAsCompleted, refetch]);

  const handleCancel = useCallback(async (id: string, reason: string) => {
    await cancelBooking(id, reason);
    refetch();
  }, [cancelBooking, refetch]);

  const handleCreateReview = useCallback(async (data: any) => {
    await createReview(data);
    refetch();
  }, [createReview, refetch]);

  const handleStartWork = useCallback(async (id: string) => {
    await updateBooking(id, { status: 'active' });
    refetch();
  }, [updateBooking, refetch]);

  const handlePauseWork = useCallback(async (id: string) => {
    await updateBooking(id, { status: 'active' });
    refetch();
  }, [updateBooking, refetch]);

  const handleReportIssue = useCallback(async (id: string, reason: string) => {
    await updateBooking(id, { status: 'disputed', notes: reason });
    refetch();
  }, [updateBooking, refetch]);

  const handleRequestPayment = useCallback(async (id: string) => {
    console.log('Requesting payment for booking:', id);
  }, []);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  }, []);

  const handlePagination = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      status: undefined,
      sort_by: 'created_at',
      sort_order: 'DESC'
    });
    setSearchQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userRole === 'client' ? 'My Bookings' : 'Work Management'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {userRole === 'client' 
                    ? 'Manage your active and completed job bookings'
                    : 'Track your work assignments and progress'
                  }
                </p>
              </div>
            </div>
            
            <FiltersComponent
              filters={filters}
              searchQuery={searchQuery}
              showFilters={showFilters}
              onFilterChange={handleFilterChange}
              onSearchChange={setSearchQuery}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Stats */}
        <StatsComponent stats={stats} userRole={userRole} />

        {/* Error State */}
        {error && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            filters={filters}
            userRole={userRole}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Bookings List */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole={userRole}
                onMarkComplete={handleMarkComplete}
                onCancel={handleCancel}
                onCreateReview={handleCreateReview}
                onStartWork={handleStartWork}
                onPauseWork={handlePauseWork}
                onReportIssue={handleReportIssue}
                onRequestPayment={handleRequestPayment}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <BookingPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={filters.limit}
            onPageChange={handlePagination}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
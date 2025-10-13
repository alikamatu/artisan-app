"use client";

import React, { useState } from 'react';
import { 
  Briefcase, 
  Search,
} from 'lucide-react';
import { useBookings } from '@/lib/hooks/useBookings';
import { Booking, BookingStatus } from '@/lib/types/booking';
import { BookingFilters } from './booking-filters';
import { BookingStats } from './booking-stats';
import { BookingActionsModal } from './booking-actions-modal';
import { BookingCard } from './booking-card';

export const BookingManagementSystem: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  
  const { bookings, isLoading, error, refetch } = useBookings();

  // Filter bookings based on status and search
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      booking.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.worker?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleBookingAction = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowActionsModal(true);
  };

  const handleActionComplete = () => {
    setShowActionsModal(false);
    setSelectedBooking(null);
    refetch(); // Refresh the bookings list
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                Booking Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your job bookings in one place
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs or workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <BookingStats bookings={bookings} />

        {/* Filters */}
        <BookingFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onActionClick={() => handleBookingAction(booking)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matching bookings' : 'No bookings yet'}
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'When you accept job applications, your bookings will appear here.'
              }
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">Failed to load bookings</h4>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions Modal */}
        {showActionsModal && selectedBooking && (
          <BookingActionsModal
            booking={selectedBooking}
            onClose={() => setShowActionsModal(false)}
            onActionComplete={handleActionComplete}
          />
        )}
      </div>
    </div>
  );
};
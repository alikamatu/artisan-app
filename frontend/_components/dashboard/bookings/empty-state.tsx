import React from 'react';
import { Calendar } from 'lucide-react';
import { BookingFilters } from '@/lib/types/booking-management.ts';

interface EmptyStateProps {
  searchQuery: string;
  filters: BookingFilters;
  userRole: 'client' | 'worker';
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  filters,
  userRole,
  onResetFilters
}) => (
  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
    <p className="text-gray-600 max-w-md mx-auto mb-6">
      {searchQuery || filters.status
        ? "No bookings match your current search and filters. Try adjusting your criteria."
        : userRole === 'client' 
          ? "You haven't booked any workers yet. Start by posting a job or accepting applications."
          : "You don't have any work assignments yet. Complete your profile to get matched with jobs."
      }
    </p>
    {(searchQuery || filters.status) && (
      <button
        onClick={onResetFilters}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Clear Search & Filters
      </button>
    )}
  </div>
);

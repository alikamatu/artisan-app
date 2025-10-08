import React from 'react';
import { Filter, Search } from 'lucide-react';
import { BookingFilters as BookingFiltersType } from '@/lib/types/booking-management.ts';

interface BookingFiltersProps {
  filters: BookingFiltersType;
  searchQuery: string;
  showFilters: boolean;
  onFilterChange: (key: string, value: any) => void;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

const statusConfig = {
  active: { label: 'Active' },
  completed: { label: 'Completed' },
  cancelled: { label: 'Cancelled' },
  disputed: { label: 'Disputed' }
};

export const BookingFilters: React.FC<BookingFiltersProps> = ({
  filters,
  searchQuery,
  showFilters,
  onFilterChange,
  onSearchChange,
  onToggleFilters,
  onResetFilters
}) => {
  const hasActiveFilters = Object.values(filters).some(
    v => v !== undefined && v !== 'created_at' && v !== 'DESC' && v !== 1 && v !== 10
  );

  return (
    <>
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-64"
          />
        </div>
        
        <button
          onClick={onToggleFilters}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl border transition-all duration-200 font-semibold ${
            showFilters 
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow-sm'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value || undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Statuses</option>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sort_by}
                onChange={(e) => onFilterChange('sort_by', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="created_at">Date Created</option>
                <option value="start_date">Start Date</option>
                <option value="expected_completion_date">Completion Date</option>
                <option value="final_budget">Budget</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
              <select
                value={filters.sort_order}
                onChange={(e) => onFilterChange('sort_order', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Items Per Page</label>
              <select
                value={filters.limit}
                onChange={(e) => onFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onResetFilters}
              className="px-6 py-2 text-sm text-gray-600 hover:text-gray-700 font-semibold"
            >
              Reset All
            </button>
            <button
              onClick={onToggleFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};
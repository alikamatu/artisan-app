"use client";

import React from 'react';
import { ApplicationStatus } from '@/lib/types/applications';
import { Search, Filter, SortAsc, X } from 'lucide-react';

interface ApplicationsFilterProps {
  filters: {
    status: ApplicationStatus | '';
    search: string;
    sortBy: 'created_at' | 'proposed_budget';
    sortOrder: 'ASC' | 'DESC';
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  applicationCount: number;
  totalCount: number;
}

const ApplicationsFilter: React.FC<ApplicationsFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  applicationCount,
  totalCount
}) => {
  const hasActiveFilters = filters.status || filters.search;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {applicationCount} of {totalCount} applications
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value={ApplicationStatus.PENDING}>Pending</option>
            <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
            <option value={ApplicationStatus.REJECTED}>Rejected</option>
            <option value={ApplicationStatus.WITHDRAWN}>Withdrawn</option>
          </select>

          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('sortOrder', sortOrder);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at-DESC">Newest First</option>
            <option value="created_at-ASC">Oldest First</option>
            <option value="proposed_budget-DESC">Budget: High to Low</option>
            <option value="proposed_budget-ASC">Budget: Low to High</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsFilter;
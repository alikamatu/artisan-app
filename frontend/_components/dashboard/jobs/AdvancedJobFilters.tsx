"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Star, 
  Clock,
  Users,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { 
  JobFilters, 
  JobCategory, 
  GhanaRegion, 
  JobUrgency,
  JobStatus,
  JobCurrentStatus 
} from '@/lib/types/jobs';
import { 
  JOB_CATEGORIES, 
  GHANA_REGIONS, 
  RATING_THRESHOLDS,
  DISTANCE_OPTIONS,
  AVAILABILITY_FILTERS 
} from '@/constants/jobConstants';

interface AdvancedJobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
  totalResults?: number;
}

export default function AdvancedJobFilters({
  filters,
  onFiltersChange,
  onSearch,
  isLoading = false,
  totalResults = 0
}: AdvancedJobFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Update internal search term when filters change externally
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const updateFilter = (key: keyof JobFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchTerm);
    onSearch();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10
    });
  };

  const getActiveFiltersCount = () => {
    const excludeKeys = ['page', 'limit', 'sort_by', 'sort_order'];
    return Object.entries(filters).filter(([key, value]) => 
      !excludeKeys.includes(key) && 
      value !== undefined && 
      value !== null && 
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for jobs, skills, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Search
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                showAdvancedFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sliders className="h-4 w-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </form>

        {/* Results Count */}
        {totalResults > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            {totalResults.toLocaleString()} jobs found
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 space-y-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {Object.values(JOB_CATEGORIES).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Region
              </label>
              <select
                value={filters.region || ''}
                onChange={(e) => updateFilter('region', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Regions</option>
                {Object.values(GHANA_REGIONS).map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => updateFilter('city', e.target.value || undefined)}
                placeholder="Enter city name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4" />
              Budget Range (GHS)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  value={filters.min_budget || ''}
                  onChange={(e) => updateFilter('min_budget', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Minimum budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Statuses</option>
                <option value={JobStatus.OPEN}>Open</option>
                <option value={JobStatus.IN_PROGRESS}>In Progress</option>
                <option value={JobStatus.COMPLETED}>Completed</option>
                <option value={JobStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <select
                value={filters.urgency || ''}
                onChange={(e) => updateFilter('urgency', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Urgencies</option>
                <option value={JobUrgency.LOW}>Low Priority</option>
                <option value={JobUrgency.MEDIUM}>Medium Priority</option>
                <option value={JobUrgency.HIGH}>High Priority</option>
                <option value={JobUrgency.URGENT}>Urgent</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Availability
              </label>
              <select
                value={filters.availability_filter || ''}
                onChange={(e) => updateFilter('availability_filter', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Any Availability</option>
                {AVAILABILITY_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating and Review Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="h-4 w-4" />
                Minimum Rating
              </label>
              <select
                value={filters.min_rating || ''}
                onChange={(e) => updateFilter('min_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Any Rating</option>
                {RATING_THRESHOLDS.map((threshold) => (
                  <option key={threshold.value} value={threshold.value}>
                    {threshold.label} - {threshold.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Reviews</label>
              <input
                type="number"
                min="0"
                value={filters.min_review_count || ''}
                onChange={(e) => updateFilter('min_review_count', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Distance Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              Maximum Distance
            </label>
            <select
              value={filters.max_distance_km || ''}
              onChange={(e) => updateFilter('max_distance_km', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Any Distance</option>
              {DISTANCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Additional Filters</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.verified_clients_only || false}
                  onChange={(e) => updateFilter('verified_clients_only', e.target.checked || undefined)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Verified clients only</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.with_reviews_only || false}
                  onChange={(e) => updateFilter('with_reviews_only', e.target.checked || undefined)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Jobs with reviews only</span>
              </label>
            </div>
          </div>

          {/* Sort Options */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => updateFilter('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="created_at">Date Posted</option>
                  <option value="budget_min">Budget (Low to High)</option>
                  <option value="budget_max">Budget (High to Low)</option>
                  <option value="views_count">Most Viewed</option>
                  <option value="applications_count">Most Applied</option>
                  <option value="rating">Highest Rated Clients</option>
                  <option value="distance">Closest to Me</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Order</label>
                <select
                  value={filters.sort_order || 'DESC'}
                  onChange={(e) => updateFilter('sort_order', e.target.value as 'ASC' | 'DESC')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active` : 'No filters active'}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={onSearch}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Filter className="h-4 w-4" />
                  )}
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && !showAdvancedFilters && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {JOB_CATEGORIES[filters.category]?.name}
                <button
                  onClick={() => updateFilter('category', undefined)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.region && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {GHANA_REGIONS[filters.region]?.name}
                <button
                  onClick={() => updateFilter('region', undefined)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.min_budget && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Min: GHS {filters.min_budget}
                <button
                  onClick={() => updateFilter('min_budget', undefined)}
                  className="ml-1 hover:text-yellow-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.max_budget && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Max: GHS {filters.max_budget}
                <button
                  onClick={() => updateFilter('max_budget', undefined)}
                  className="ml-1 hover:text-yellow-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.min_rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {filters.min_rating}+ stars
                <button
                  onClick={() => updateFilter('min_rating', undefined)}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
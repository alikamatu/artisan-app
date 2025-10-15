"use client";

import React, { useState, useMemo } from 'react';
import { useMyApplications } from '@/lib/hooks/useApplications';
import { ApplicationStatus } from '@/lib/types/applications';
import ApplicationCard from './application-card';
import ApplicationsFilter from './applications-filter';
import ApplicationsStats from './applications-stats';
import LoadingState from './loading-state';
import EmptyState from './empty-state';

interface JobApplicationsViewProps {
  user: { role: string };
  showHeader?: boolean;
  maxItems?: number;
}

const JobApplicationsView: React.FC<JobApplicationsViewProps> = ({
  user,
  showHeader = true,
  maxItems = 20
}) => {
  const [filters, setFilters] = useState({
    status: '' as ApplicationStatus | '',
    search: '',
    sortBy: 'created_at' as 'created_at' | 'proposed_budget',
    sortOrder: 'DESC' as 'ASC' | 'DESC'
  });

  const { 
    applications, 
    total, 
    isLoading, 
    error, 
    refetch 
  } = useMyApplications({
    page: 1,
    limit: maxItems,
    status: filters.status || undefined,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder
  });
  // Filter applications based on search term
  const filteredApplications = useMemo(() => {
    if (!filters.search) return applications;

    const searchTerm = filters.search.toLowerCase();
    return applications.filter(app => 
      app.job?.title?.toLowerCase().includes(searchTerm) ||
      app.cover_letter?.toLowerCase().includes(searchTerm) ||
      app.job?.category?.toLowerCase().includes(searchTerm)
    );
  }, [applications, filters.search]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading applications: {error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="border-b border-gray-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Job Applications</h1>
              <p className="text-gray-600 mt-1">
                Track and manage your job applications
              </p>
            </div>
            <ApplicationsStats applications={applications} />
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <ApplicationsFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        applicationCount={filteredApplications.length}
        totalCount={total}
      />

      {/* Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingState />
        ) : filteredApplications.length === 0 ? (
          <EmptyState 
            hasFilters={!!filters.status || !!filters.search}
            onClearFilters={clearFilters}
          />
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsView;
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs, useMyJobs } from '@/lib/hooks/useJob';
import { JobFilters, Job } from '@/lib/types/jobs';
import ResultsHeader from './joblist/ResultsHeader';
import FilterSidebar from './joblist/FilterSidebar';
import JobCard from './joblist/JobCard';
import SearchBar from './joblist/SearchBar';
import FilterButton from './joblist/FilterButton';
import SortDropdown from './joblist/SortDropdown';
import QuickFilters from './joblist/QuickFilters';
import SkeletonLoader from './joblist/SkeletonLoader';
import NoResults from './joblist/NoResults';
import ErrorDisplay from './joblist/ErrorDisplay';
import Pagination from './joblist/Pagination';

interface JobListProps {
  showMyJobs?: boolean;
  clientId: string;
  title: string;
  subtitle?: string;
  showCreateButton?: boolean;
}


export default function JobList({ 
  showMyJobs = false, 
  clientId, 
  title, 
  subtitle, 
  showCreateButton 
}: JobListProps) {

  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 12,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { 
    jobs, 
    total, 
    page, 
    totalPages, 
    isLoading, 
    error, 
    refetch 
  } = showMyJobs ? useMyJobs(filters) : useJobs(filters);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length === 0 || searchInput.length >= 2) {
        setDebouncedSearch(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch || undefined,
      page: 1
    }));
  }, [debouncedSearch]);

  const handleFilterChange = useCallback((newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleJobClick = useCallback((jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}`);
  }, [router]);

  const handleApplyToJob = useCallback((e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/jobs/${jobId}/apply`);
  }, [router]);

  const toggleSaveJob = useCallback((e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setFilters({
      page: 1,
      limit: 12,
      sort_by: 'created_at',
      sort_order: 'DESC'
    });
    setShowFilters(false);
  }, []);

if (error) {
  return <ErrorDisplay error={error} refetch={refetch} />;
}

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
            <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
            <FilterButton showFilters={showFilters} setShowFilters={setShowFilters} />
            <SortDropdown filters={filters} handleFilterChange={handleFilterChange} />
          </div>
          <QuickFilters filters={filters} handleFilterChange={handleFilterChange} clearFilters={clearFilters} />
        </div>
      </div>

      <FilterSidebar 
        showFilters={showFilters} 
        setShowFilters={setShowFilters} 
        filters={filters} 
        handleFilterChange={handleFilterChange} 
        clearFilters={clearFilters} 
      />

      <ResultsHeader 
        isLoading={isLoading} 
        total={total} 
        debouncedSearch={debouncedSearch} 
        filters={filters} 
        page={page} 
        totalPages={totalPages} 
      />

      <div className="space-y-6">
        {isLoading && jobs.length === 0 ? (
          <SkeletonLoader />
        ) : jobs.length === 0 ? (
          <NoResults showMyJobs={showMyJobs} router={router} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job) => (
              <JobCard
                key={job.id}
                job={job}
                showMyJobs={showMyJobs}
                savedJobs={savedJobs}
                onJobClick={handleJobClick}
                onApply={handleApplyToJob}
                onSave={toggleSaveJob}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination 
          page={page} 
          totalPages={totalPages} 
          isLoading={isLoading} 
          handlePageChange={handlePageChange} 
          filters={filters} 
          total={total} 
        />
      )}
    </div>
  );
}
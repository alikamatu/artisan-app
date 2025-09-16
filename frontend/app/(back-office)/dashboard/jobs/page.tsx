"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Filter, MapPin, DollarSign, Clock, Star, CheckCircle, Search, TrendingUp, Briefcase, Users, Zap } from 'lucide-react';
import JobList from '@/_components/dashboard/jobs/JobList';
import AdvancedJobFilters from '@/_components/dashboard/jobs/AdvancedJobFilters';
import { JobFilters, JobUrgency } from '@/lib/types/jobs';

export default function JobsDashboard() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 12,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleCreateJob = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/?redirect=' + encodeURIComponent('/dashboard/jobs/create'));
      return;
    }
    router.push('/dashboard/jobs/create-job');
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 800);
  };

  const quickFilters = [
    {
      key: 'urgency',
      value: JobUrgency.URGENT,
      label: 'Urgent',
      icon: Clock,
      color: 'red',
      description: 'Find urgent opportunities'
    },
    {
      key: 'min_rating',
      value: 4,
      label: '4+ Stars',
      icon: Star,
      color: 'amber',
      description: 'Top-rated clients'
    },
    {
      key: 'verified_clients_only',
      value: true,
      label: 'Verified Clients',
      icon: CheckCircle,
      color: 'green',
      description: 'Trusted employers'
    },
    {
      key: 'max_distance_km',
      value: 10,
      label: 'Nearby',
      icon: MapPin,
      color: 'blue',
      description: 'Within 10km'
    },
    {
      key: 'min_budget',
      value: 100,
      label: 'GHS 100+',
      icon: DollarSign,
      color: 'emerald',
      description: 'Higher paying jobs'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-8">
            <AdvancedJobFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Job List */}
        <div className="overflow-hidden">
          <div className="p-8">
            <JobList showMyJobs={false} clientId={""} title={"All Jobs"} />
          </div>
        </div>
      </div>
    </div>
  );
}
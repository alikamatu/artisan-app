"use client";

import React from 'react';
import { Filter, Briefcase } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';

interface JobSelectorProps {
  applications: JobApplication[];
  selectedJobId: string | null;
  onJobSelect: (jobId: string | null) => void;
}

export const JobSelector: React.FC<JobSelectorProps> = ({
  applications,
  selectedJobId,
  onJobSelect
}) => {
  // Get unique jobs from applications
  const jobs = Array.from(
    new Map(
      applications
        .filter(app => app.job)
        .map(app => [app.job!.id, app.job!])
    ).values()
  );

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter by Job</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onJobSelect(null)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedJobId === null
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Jobs
        </button>
        
        {jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => onJobSelect(job.id)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              selectedJobId === job.id
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span className="truncate max-w-[150px]">{job.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
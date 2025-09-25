import React from 'react';
import { FolderOpen, Building2 } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';

interface JobApplicationsGroup {
  jobId: string;
  jobTitle: string;
  applications: JobApplication[];
}

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
  const jobGroups = applications.reduce((groups, app) => {
    if (!app.job) return groups;
    
    const jobId = app.job.id;
    if (!groups[jobId]) {
      groups[jobId] = {
        jobId,
        jobTitle: app.job.title,
        applications: []
      };
    }
    groups[jobId].applications.push(app);
    return groups;
  }, {} as Record<string, JobApplicationsGroup>);

  const jobList = Object.values(jobGroups);
  const totalApplications = applications.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Select Job to View Applications</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={() => onJobSelect(null)}
          className={`p-3 rounded-lg border-2 text-left transition-all ${
            selectedJobId === null 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <FolderOpen className={`h-5 w-5 ${
              selectedJobId === null ? 'text-green-600' : 'text-gray-400'
            }`} />
            <div>
              <p className={`font-medium ${
                selectedJobId === null ? 'text-green-900' : 'text-gray-900'
              }`}>
                All Applications
              </p>
              <p className="text-sm text-gray-500">{totalApplications} applications</p>
            </div>
          </div>
        </button>

        {jobList.map((jobGroup) => (
          <button
            key={jobGroup.jobId}
            onClick={() => onJobSelect(jobGroup.jobId)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selectedJobId === jobGroup.jobId
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className={`h-5 w-5 ${
                selectedJobId === jobGroup.jobId ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  selectedJobId === jobGroup.jobId ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {jobGroup.jobTitle}
                </p>
                <p className="text-sm text-gray-500">
                  {jobGroup.applications.length} application{jobGroup.applications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
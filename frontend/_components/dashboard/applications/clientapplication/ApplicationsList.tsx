import React from 'react';
import { Target, AlertCircle, RefreshCw } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';
import { ApplicationCard } from './ApplicationCard';

interface ApplicationsListProps {
  applications: JobApplication[];
  selectedJobId: string | null;
  expandedItems: Set<string>;
  actionLoadingId: string | null;
  onToggleExpanded: (id: string) => void;
  onAccept: (id: string) => void;
  onShowRejectModal: (id: string) => void;
  onShowBookingModal: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  selectedJobId,
  expandedItems,
  actionLoadingId,
  onToggleExpanded,
  onAccept,
  onShowRejectModal,
  onShowBookingModal,
  isLoading = false,
  error = null,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <RefreshCw className="h-8 w-8 text-green-600 animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-900">Failed to load applications</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {selectedJobId ? 'No Applications for Selected Job' : 'No Applications Found'}
        </h3>
        <p className="text-gray-600">
          {selectedJobId 
            ? 'There are no applications for the selected job yet.'
            : 'No applications match your current filters.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isExpanded={expandedItems.has(application.id)}
            isActioning={actionLoadingId === application.id}
            selectedJobId={selectedJobId}
            onToggleExpand={onToggleExpanded}
            onAccept={onAccept}
            onShowRejectModal={onShowRejectModal}
            onShowBookingModal={onShowBookingModal}
          />
        ))}
      </div>
    </div>
  );
};
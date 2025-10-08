// components/applications-list.tsx
"use client";

import React from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';
import { ApplicationCard } from './application-card';

interface ApplicationsListProps {
  applications: JobApplication[];
  selectedJobId: string | null;
  expandedItems: Set<string>;
  actionLoadingId: string;
  onToggleExpanded: (id: string) => void;
  onAccept: (id: string) => void;
  onShowRejectModal: (id: string) => void;
  onShowBookingModal: (id: string) => void;
  onStatusUpdate: () => void; // Add this prop
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
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
  onStatusUpdate, // Add this prop
  isLoading,
  error,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-900">Failed to load applications</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={onRetry}
              className="mt-3 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">No applications found</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          {selectedJobId 
            ? "No applications match your current filters. Try selecting a different job or check back later."
            : "You haven't received any applications yet. Applications will appear here when workers apply to your jobs."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedJobId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Showing applications for selected job ({applications.length} total)
          </p>
        </div>
      )}
      
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isExpanded={expandedItems.has(application.id)}
          isActionLoading={actionLoadingId === application.id}
          onToggleExpand={() => onToggleExpanded(application.id)}
          onAccept={onAccept}
          onShowRejectModal={onShowRejectModal}
          onShowBookingModal={onShowBookingModal}
          onStatusUpdate={onStatusUpdate} // Pass the prop here
        />
      ))}
    </div>
  );
};
"use client";

import React, { useState, useCallback } from 'react';
import { Briefcase, AlertCircle } from 'lucide-react';
import { useClientApplications, useApplicationActions } from '@/lib/hooks/useApplications';
import { ApplicationStatus } from '@/lib/types/applications';
import { ApplicationStats } from './application-stats';
import { JobSelector } from './job-selector';
import { ApplicationsList } from './applications-list';
import { RejectModal } from './reject-modal';
import BookingCreationModal from '../bookings/booking-creation-modal';

interface JobApplicationsViewProps {
  user: any;
  initialFilters?: any;
  showHeader?: boolean;
  maxItems?: number;
}

export const JobApplicationsView: React.FC<JobApplicationsViewProps> = ({
  user,
  initialFilters = {},
  showHeader = true,
  maxItems = 10
}) => {
  const [filters] = useState({
    page: 1,
    limit: maxItems,
    sort_by: 'created_at' as const,
    sort_order: 'DESC' as const,
    ...initialFilters
  });

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; applicationId: string | null }>({
    isOpen: false,
    applicationId: null
  });
  const [bookingModal, setBookingModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const {
    applications,
    isLoading,
    error,
    refetch
  } = useClientApplications(filters);

  const {
    acceptApplication,
    rejectApplication,
    isLoading: actionLoading,
    error: actionError,
    clearError
  } = useApplicationActions();

  // Filter applications by selected job
  const filteredApplications = selectedJobId
    ? applications.filter(app => app.job?.id === selectedJobId)
    : applications;

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
    accepted: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    rejected: applications.filter(app => app.status === ApplicationStatus.REJECTED).length
  };

  const handleAccept = useCallback(async (applicationId: string) => {
    try {
      await acceptApplication(applicationId);
      refetch();
      setBookingModal(applicationId);
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  }, [acceptApplication, refetch]);

  const handleReject = useCallback(async () => {
    if (!rejectModal.applicationId) return;
    
    try {
      await rejectApplication(rejectModal.applicationId, rejectReason.trim() || undefined);
      refetch();
      setRejectModal({ isOpen: false, applicationId: null });
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject application:', error);
    }
  }, [rejectApplication, rejectModal.applicationId, rejectReason, refetch]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const currentApplication = bookingModal 
    ? applications.find(app => app.id === bookingModal)
    : null;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-600" />
              Job Applications
            </h2>
            <p className="text-gray-600 mt-1">
              Review applications organized by job
            </p>
          </div>
        </div>
      )}

      <ApplicationStats stats={stats} />

      <JobSelector
        applications={applications}
        selectedJobId={selectedJobId}
        onJobSelect={setSelectedJobId}
      />

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Action failed</h4>
              <p className="text-red-700 text-sm mt-1">{actionError}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <ApplicationsList
        applications={filteredApplications}
        selectedJobId={selectedJobId}
        expandedItems={expandedItems}
        actionLoadingId={actionLoading ? rejectModal.applicationId || bookingModal || '' : ''}
        onToggleExpanded={toggleExpanded}
        onAccept={handleAccept}
        onShowRejectModal={(id) => setRejectModal({ isOpen: true, applicationId: id })}
        onShowBookingModal={setBookingModal}
        onStatusUpdate={refetch} // Pass the refetch function here
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      <RejectModal
        isOpen={rejectModal.isOpen}
        isLoading={actionLoading}
        rejectReason={rejectReason}
        onRejectReasonChange={setRejectReason}
        onConfirm={handleReject}
        onCancel={() => {
          setRejectModal({ isOpen: false, applicationId: null });
          setRejectReason('');
        }}
      />

      {bookingModal && currentApplication && (
        <BookingCreationModal
          application={currentApplication}
          onClose={() => setBookingModal(null)}
          onSuccess={() => {
            setBookingModal(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default JobApplicationsView;
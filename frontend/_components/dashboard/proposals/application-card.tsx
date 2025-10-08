"use client";

import React from 'react';
import { ChevronDown, ChevronUp, MapPin, Star, Calendar, DollarSign } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { ApplicationActions } from './application-actions';
import { WorkerInfo } from './worker-info';

interface ApplicationCardProps {
  application: JobApplication;
  isExpanded: boolean;
  isActionLoading: boolean;
  onToggleExpand: () => void;
  onAccept: (id: string) => void;
  onShowRejectModal: (id: string) => void;
  onShowBookingModal: (id: string) => void;
  onStatusUpdate: () => void; // Add this prop
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  isExpanded,
  isActionLoading,
  onToggleExpand,
  onAccept,
  onShowRejectModal,
  onShowBookingModal,
  onStatusUpdate // Add this prop
}) => {
  const statusColors = {
    [ApplicationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
    [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
    [ApplicationStatus.WITHDRAWN]: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {application.job?.title || 'Unknown Job'}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[application.status]}`}>
                {application.status}
              </span>
            </div>
            
            <WorkerInfo worker={application.worker} />
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>GHS {application.proposed_budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(application.availability_start_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-3">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          {/* Cover Letter */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
            <p className="text-gray-700 text-sm leading-relaxed">
              {application.cover_letter}
            </p>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Proposed Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">GHS {application.proposed_budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{application.estimated_completion_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">
                    {new Date(application.availability_start_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Date:</span>
                  <span className="font-medium">
                    {application.completion_date ? new Date(application.completion_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {application.worker && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Worker Stats</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{application.worker.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jobs Completed:</span>
                    <span className="font-medium">{application.worker.total_jobs_completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {application.worker.location?.city}, {application.worker.location?.region}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {application.worker?.skills && application.worker.skills.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {application.worker.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <ApplicationActions
            application={application}
            isLoading={isActionLoading}
            onAccept={onAccept}
            onReject={onShowRejectModal}
            onShowBookingModal={onShowBookingModal}
            onStatusUpdate={onStatusUpdate} // Pass the prop here
          />
        </div>
      )}
    </div>
  );
};
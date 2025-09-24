"use client";

import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ArrowRight,
  Calendar,
  DollarSign,
  Star
} from 'lucide-react';
import { ApplicationStatus } from '@/lib/types/applications';

interface ApplicationStatusTrackerProps {
  application: {
    id: string;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
    proposed_budget: number;
    accepted_at?: string;
    rejected_at?: string;
    withdrawn_at?: string;
    rejection_reason?: string;
  };
  job: {
    id: string;
    title: string;
    budget_min: number;
    budget_max: number;
    status: string;
  };
  worker: {
    id: string;
    name: string;
    display_name?: string;
    rating?: number;
  };
  showRatingOption?: boolean;
  onRate?: () => void;
  compact?: boolean;
}

const statusSteps = [
  {
    key: 'submitted',
    label: 'Application Submitted',
    icon: Clock,
    description: 'Worker submitted their application'
  },
  {
    key: 'under_review',
    label: 'Under Review',
    icon: Clock,
    description: 'Client is reviewing the application'
  },
  {
    key: 'decision_made',
    label: 'Decision Made',
    icon: CheckCircle,
    description: 'Application was accepted or rejected'
  },
  {
    key: 'work_started',
    label: 'Work Started',
    icon: ArrowRight,
    description: 'Worker has begun the project'
  },
  {
    key: 'completed',
    label: 'Project Completed',
    icon: CheckCircle,
    description: 'Work has been finished'
  },
  {
    key: 'rated',
    label: 'Worker Rated',
    icon: Star,
    description: 'Client has provided feedback'
  }
];

export default function ApplicationStatusTracker({
  application,
  job,
  worker,
  showRatingOption = false,
  onRate,
  compact = false
}: ApplicationStatusTrackerProps) {
  
  const getStatusStep = () => {
    switch (application.status) {
      case ApplicationStatus.PENDING:
        return 1; // Under review
      case ApplicationStatus.ACCEPTED:
        if (job.status === 'completed') {
          return showRatingOption ? 4 : 5; // Completed (show rating option or done)
        }
        return job.status === 'in_progress' ? 3 : 2; // Work started or decision made
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.WITHDRAWN:
        return 2; // Decision made
      default:
        return 0;
    }
  };

  const currentStep = getStatusStep();
  const isRejectedOrWithdrawn = [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN].includes(application.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDisplayName = () => {
    return worker.display_name || worker.name;
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Application Status</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${
            application.status === ApplicationStatus.ACCEPTED
              ? 'text-green-700 bg-green-100 border-green-200'
              : application.status === ApplicationStatus.REJECTED
              ? 'text-red-700 bg-red-100 border-red-200'
              : application.status === ApplicationStatus.WITHDRAWN
              ? 'text-gray-700 bg-gray-100 border-gray-200'
              : 'text-yellow-700 bg-yellow-100 border-yellow-200'
          }`}>
            {application.status === ApplicationStatus.ACCEPTED && <CheckCircle className="h-3 w-3" />}
            {application.status === ApplicationStatus.REJECTED && <XCircle className="h-3 w-3" />}
            {application.status === ApplicationStatus.WITHDRAWN && <RefreshCw className="h-3 w-3" />}
            {application.status === ApplicationStatus.PENDING && <Clock className="h-3 w-3" />}
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>Applied: {formatDate(application.created_at)}</p>
          <p>Proposed: {formatBudget(application.proposed_budget)}</p>
          {application.updated_at !== application.created_at && (
            <p>Updated: {formatDate(application.updated_at)}</p>
          )}
        </div>

        {showRatingOption && onRate && (
          <button
            onClick={onRate}
            className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Rate Worker
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Application Progress</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Applied {formatDate(application.created_at)}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const isSkipped = isRejectedOrWithdrawn && index > 2;
          
          // Don't show work steps if rejected/withdrawn
          if (isRejectedOrWithdrawn && index > 2) {
            return null;
          }
          
          // Don't show rating step if not applicable
          if (step.key === 'rated' && !showRatingOption) {
            return null;
          }

          const StepIcon = step.icon;
          
          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isActive
                    ? isCurrent 
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  
                  {/* Show timestamp for completed steps */}
                  {isActive && !isCurrent && (
                    <span className="text-xs text-gray-500">
                      {index === 0 && formatDate(application.created_at)}
                      {index === 2 && application.accepted_at && formatDate(application.accepted_at)}
                      {index === 2 && application.rejected_at && formatDate(application.rejected_at)}
                      {index === 2 && application.withdrawn_at && formatDate(application.withdrawn_at)}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mt-1 ${
                  isActive ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
                
                {/* Special content for decision step */}
                {step.key === 'decision_made' && isCurrent && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    {application.status === ApplicationStatus.ACCEPTED && (
                      <div className="text-sm text-green-700">
                        <p className="font-medium">Application Accepted!</p>
                        <p>Budget approved: {formatBudget(application.proposed_budget)}</p>
                        <p>Work can now begin.</p>
                      </div>
                    )}
                    
                    {application.status === ApplicationStatus.REJECTED && (
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Application Rejected</p>
                        {application.rejection_reason && (
                          <p className="mt-1">Reason: {application.rejection_reason}</p>
                        )}
                      </div>
                    )}
                    
                    {application.status === ApplicationStatus.WITHDRAWN && (
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">Application Withdrawn</p>
                        <p>{getDisplayName()} withdrew their application.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Rating option */}
                {step.key === 'rated' && isCurrent && showRatingOption && onRate && (
                  <div className="mt-3">
                    <button
                      onClick={onRate}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Star className="h-4 w-4" />
                      Rate {getDisplayName()}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Help other clients by sharing your experience
                    </p>
                  </div>
                )}
              </div>
              
              {/* Connection line to next step */}
              {index < statusSteps.length - 1 && (!isRejectedOrWithdrawn || index < 2) && (
                <div className={`absolute left-9 mt-10 w-0.5 h-6 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{formatBudget(application.proposed_budget)}</p>
            <p className="text-xs text-gray-500">Proposed Budget</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil((new Date().getTime() - new Date(application.created_at).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs text-gray-500">Days Since Applied</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {worker.rating ? `${worker.rating}★` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">Worker Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationStatusBadge from './application-status-badge';
import ApplicationActions from './application-actions';

interface ApplicationCardProps {
  application: JobApplication;
  onStatusUpdate: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onStatusUpdate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <ApplicationStatusBadge status={application.status} />
              <span className="text-sm text-gray-500">
                Applied {formatDate(application.created_at)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {application.job?.title || 'Job Title Not Available'}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatCurrency(application.proposed_budget)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{application.estimated_completion_time}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Start: {formatDate(application.availability_start_date)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ApplicationActions 
              application={application}
              onStatusUpdate={onStatusUpdate}
            />
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Cover Letter */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <MessageSquare className="h-4 w-4" />
                  Cover Letter
                </h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                  {application.cover_letter}
                </p>
              </div>

              {/* Job Details */}
              {application.job && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Briefcase className="h-4 w-4" />
                      Job Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget Range:</span>
                        <span className="font-medium">
                          {formatCurrency(application.job.budget_min)} - {formatCurrency(application.job.budget_max)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">
                          {application.job.category?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">
                          {application.job.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Clock className="h-4 w-4" />
                      Application Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applied:</span>
                        <span className="font-medium">{formatDate(application.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(application.updated_at)}</span>
                      </div>
                      {application.completion_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Completion:</span>
                          <span className="font-medium">{formatDate(application.completion_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {application.status === ApplicationStatus.REJECTED && application.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">Reason for Rejection</h4>
                  <p className="text-red-700 text-sm">{application.rejection_reason}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplicationCard;
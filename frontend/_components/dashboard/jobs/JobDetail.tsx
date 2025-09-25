"use client";

import React, { useState } from 'react';
import { useJob } from '@/lib/hooks/useJob';
import { useApplicationStatus } from '@/lib/hooks/useApplications';
import JobApplicationModal from './JobApplicationModal';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Eye, 
  Users, 
  Calendar, 
  AlertTriangle, 
  ArrowLeft, 
  Bookmark, 
  Send, 
  Star, 
  CheckCircle,
  User,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatus } from '@/lib/types/applications';
import { useAuth } from '@/context/AuthContext';
import { applicationStatusColors, applicationStatusLabels, urgencyColors, urgencyLabels, regionNames, categoryLabels } from '@/constants/jobConstants';
import { formatLocationDisplay, parseLocation, formatCategory, getInitials, getProfilePhoto, getDisplayName, formatDate, formatBudget } from '@/helpers/job-helpers';

interface JobDetailProps {
  jobId: string;
}

export default function JobDetailPage({ jobId }: JobDetailProps) {
  const { job, isLoading, error, refetch } = useJob(jobId);
  const { user } = useAuth(); // Get current user
  const { applicationStatus, isLoading: checkingStatus, refetch: refetchStatus } = useApplicationStatus(jobId);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleApplyClick = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    refetchStatus();
    refetch(); // Refresh job data to update application count
  };

  const canApply = () => {
    if (!user) return false;
    if (!job) return false;
    if (user.role !== 'worker') return false;
    if (job.client_id === user.id) return false; // Can't apply to own job
    if (job.status !== 'open') return false;
    if (applicationStatus?.hasApplied) return false;
    
    return true;
  };

  const renderApplyButton = () => {
    if (!user) {
      return (
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Send className="h-5 w-5" />
          Login to Apply
        </Link>
      );
    }

    if (user.role !== 'worker') {
      return (
        <button
          disabled
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-medium"
        >
          <XCircle className="h-5 w-5" />
          Only workers can apply
        </button>
      );
    }

    if (job && job.client_id === user.id) {
      return (
        <button
          disabled
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-medium"
        >
          <User className="h-5 w-5" />
          Your Job
        </button>
      );
    }

    if (job && job.status !== 'open') {
      return (
        <button
          disabled
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-medium"
        >
          <XCircle className="h-5 w-5" />
          Job Closed
        </button>
      );
    }

    if (checkingStatus) {
      return (
        <button
          disabled
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-medium"
        >
          <RefreshCw className="h-5 w-5 animate-spin" />
          Checking Status...
        </button>
      );
    }

    if (applicationStatus?.hasApplied) {
      return (
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${applicationStatusColors[applicationStatus.status || ApplicationStatus.PENDING]}`}>
          <CheckCircle className="h-5 w-5" />
          {applicationStatusLabels[applicationStatus.status || ApplicationStatus.PENDING]}
        </div>
      );
    }

    return (
      <button
        onClick={handleApplyClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md"
      >
        <Send className="h-5 w-5" />
        Apply Now
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={refetch}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/dashboard/jobs"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/dashboard/jobs"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-xl hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Jobs</span>
            </Link>
          </div>

          {/* Main Card with Curved Edges */}
          <div className="md:bg-white md:rounded-3xl md:shadow-sm overflow-hidden md:border md:border-gray-100">
            {/* Header with gradient and curved bottom */}
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 pb-8 rounded-b-3xl">
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
              
              <div className="px-8 pt-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {formatLocationDisplay(job.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Posted {formatDate(job.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${urgencyColors[job.urgency]} border border-current border-opacity-30`}>
                    {urgencyLabels[job.urgency]}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{job.views_count} views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{job.applications_count} applications</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{formatBudget(job.budget_min, job.budget_max)}</span>
                  </div>
                  {job.estimated_duration && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{job.estimated_duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:px-8 pb-8 -mt-4 relative z-10">
              <div className="space-y-8">
                {/* Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
                    Description
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Required Skills */}
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {job.required_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Project Details */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
                      Project Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Budget Range:</span>
                        <span className="font-semibold text-green-600">
                          {formatBudget(job.budget_min, job.budget_max)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Priority:</span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${urgencyColors[job.urgency]}`}>
                          {urgencyLabels[job.urgency]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Category:</span>
                        <span className="font-medium">
                          {formatCategory(job.category)}
                        </span>
                      </div>
                      {job.estimated_duration && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Duration:</span>
                          <span className="font-medium">{job.estimated_duration}</span>
                        </div>
                      )}
                      {job.start_date && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Start Date:</span>
                          <span className="font-medium">{formatDate(job.start_date)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className="font-medium capitalize text-blue-600">
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Enhanced Client Info with Profile Photo */}
                  {job.client && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                        <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
                        Client Information
                      </h3>
                      <div className="space-y-4">
                        {/* Enhanced Client Profile Section */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="relative">
                            {getProfilePhoto(job.client) ? (
                              <img
                                src={getProfilePhoto(job.client)}
                                alt={getDisplayName(job.client)}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md border-2 border-white">
                                        ${getInitials(job.client)}
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md border-2 border-white">
                                {getInitials(job.client)}
                              </div>
                            )}
                            {job.client.verification_status === 'verified' && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900">
                              {getDisplayName(job.client)}
                            </h4>
                            <p className="text-sm text-blue-600 font-medium">
                              Client {job.client.verification_status === 'verified' && (
                                <span className="inline-flex items-center gap-1 ml-2 text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </p>
                            {job.client.first_name && job.client.last_name && (
                              <p className="text-xs text-gray-500 mt-1">
                                {job.client.first_name} {job.client.last_name}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Client Stats */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Rating:</span>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    job.client && i < Math.floor(job.client.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">
                              {job.client.rating ? `${job.client.rating}/5` : 'No ratings'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Jobs Posted:</span>
                          <span className="font-medium">{job.client.total_jobs || 0}</span>
                        </div>
                        
                        {/* Additional Client Details */}
                        {job.client.preferences && (
                          <div className="py-3">
                            <span className="text-gray-600 font-medium block mb-2">Preferred Categories:</span>
                            <div className="flex flex-wrap gap-2">
                              {job.client.preferences.categories?.slice(0, 3).map((category, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                                >
                                  {category}
                                </span>
                              ))}
                              {job.client.preferences.categories && job.client.preferences.categories.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                  +{job.client.preferences.categories.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                {(job.subcategory || (parseLocation(job.location)?.specific_address)) && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
                      Additional Details
                    </h3>
                    <div className="space-y-4">
                      {job.subcategory && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Subcategory:</span>
                          <span className="font-medium">{job.subcategory}</span>
                        </div>
                      )}
                      {parseLocation(job.location)?.specific_address && (
                        <div className="flex justify-between items-start py-2">
                          <span className="text-gray-600 font-medium">Address:</span>
                          <span className="font-medium text-right max-w-xs">
                            {parseLocation(job.location)?.specific_address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Last updated {formatDate(job.updated_at)}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium shadow-sm">
                    <Bookmark className="h-5 w-5" />
                    Save Job
                  </button>
                  {renderApplyButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {job && (
        <JobApplicationModal
          job={job}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
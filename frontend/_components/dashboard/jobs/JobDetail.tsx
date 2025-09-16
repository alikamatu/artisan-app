"use client";

import React, { useState } from 'react';
import { useJob } from '@/lib/hooks/useJob';
import { useApplicationStatus } from '@/lib/hooks/useApplications';
import JobApplicationModal from './JobApplicationModal';
import {
  MapPin,
  Calendar,
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
import {
  applicationStatusColors,
  applicationStatusLabels,
  urgencyColors,
  urgencyLabels
} from '@/constants/jobConstants';

interface JobDetailProps {
  jobId: string;
}

export default function JobDetailPage({ jobId }: JobDetailProps) {
  const { job, isLoading, error, refetch } = useJob(jobId);
  const { user } = useAuth();
  const {
    applicationStatus,
    isLoading: checkingStatus,
    refetch: refetchStatus
  } = useApplicationStatus(jobId);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const getProfilePhoto = (u: any) =>
    u?.profile_photo ||
    u?.metadata?.profile?.photo ||
    u?.parsedMetadata?.profile?.photo ||
    null;

  const getDisplayName = (u: any) =>
    u?.display_name ||
    (u?.first_name && u?.last_name
      ? `${u.first_name} ${u.last_name}`
      : u?.name || 'Unknown User');

  const getInitials = (u: any) => {
    if (u?.first_name && u?.last_name) {
      return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
    }
    if (u?.display_name) {
      return u.display_name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (u?.name) {
      return u.name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const handleApplyClick = () => setShowApplicationModal(true);

  const handleApplicationSuccess = () => {
    refetchStatus();
    refetch();
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
        <div
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${String(
            applicationStatusColors[
              applicationStatus.status || ApplicationStatus.PENDING
            ] || ''
          )}`}
        >
          <CheckCircle className="h-5 w-5" />
          {String(
            applicationStatusLabels[
              applicationStatus.status || ApplicationStatus.PENDING
            ] || 'Pending'
          )}
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

  const formatBudget = (min: number, max: number) =>
    `GHS ${min.toLocaleString()} - ${max.toLocaleString()}`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  // Loading
  if (isLoading) return <p>Loading job...</p>;
  if (error) return <p>Error: {String(error)}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          <div className="mb-8">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-xl hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Jobs</span>
            </Link>
          </div>

          <div className="md:bg-white md:rounded-3xl md:shadow-sm overflow-hidden md:border md:border-gray-100">
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 pb-8 rounded-b-3xl">
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
              <div className="px-8 pt-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {String(job.title)}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {typeof job.location === 'string'
                        ? job.location
                        : job.location?.city && job.location?.region
                        ? `${String(job.location.city)}, ${String(
                            job.location.region
                          )}`
                        : 'Unknown Location'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      Posted {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${String(
                    urgencyColors[job.urgency] || ''
                  )} border border-current border-opacity-30`}
                >
                  {String(urgencyLabels[job.urgency] || 'Normal')}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:px-8 pb-8 -mt-4 relative z-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {String(job.description || '')}
                </p>
              </div>

              {/* Skills */}
              {job.required_skills?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {job.required_skills.map((skill: any, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium shadow-sm"
                      >
                        {String(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategory + Address */}
              {(job.subcategory ||
                (typeof job.location === 'object' &&
                  job.location?.specific_address)) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  {job.subcategory && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 font-medium">
                        Subcategory:
                      </span>
                      <span className="font-medium">
                        {String(job.subcategory)}
                      </span>
                    </div>
                  )}
                  {typeof job.location === 'object' &&
                    job.location?.specific_address && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 font-medium">
                          Address:
                        </span>
                        <span className="font-medium text-right max-w-xs">
                          {String(job.location.specific_address)}
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Last updated {formatDate(job.updated_at)}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-white">
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

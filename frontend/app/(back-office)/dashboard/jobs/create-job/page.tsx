"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateJobForm from '@/_components/dashboard/jobs/CreateJobForm';

export default function CreateJobPage() {
  const router = useRouter();

  const handleSuccess = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}?created=true`);
  };

  const handleCancel = () => {
    router.push('/dashboard/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-3">
            Post a New Job
          </h1>
          <p className="text-gray-600 text-lg">
            Find the right professional for your needs across Ghana
          </p>
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-medium text-blue-900 mb-3">Tips for success:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Be specific about requirements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Choose the right category</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Set a fair budget range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Include exact location</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <CreateJobForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
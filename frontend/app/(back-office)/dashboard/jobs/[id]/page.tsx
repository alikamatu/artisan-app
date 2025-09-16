"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import JobDetail from '@/_components/dashboard/jobs/JobDetail';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <JobDetail jobId={jobId} />
    </div>
  );
}

"use client";

import JobApplicationsView from '@/_components/dashboard/applications/workerapplication/job-applications-view';
import React from 'react';

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <JobApplicationsView 
        user={{ role: 'worker' }} 
        showHeader={true}
        maxItems={20}
      />
    </div>
  );
}
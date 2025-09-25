"use client";

import JobApplicationsView from '@/_components/dashboard/applications/clientapplication/JobApplicationsView';
import React from 'react';

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <JobApplicationsView user={{ role: 'admin' }} showHeader={false} />
    </div>
  );
}

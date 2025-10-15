"use client";

import React from 'react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ApplicationsStatsProps {
  applications: JobApplication[];
}

const ApplicationsStats: React.FC<ApplicationsStatsProps> = ({ applications }) => {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
    accepted: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    rejected: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
  };

  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationsStats;
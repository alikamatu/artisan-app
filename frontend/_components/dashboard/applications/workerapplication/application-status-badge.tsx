"use client";

import React from 'react';
import { ApplicationStatus } from '@/lib/types/applications';
import { Clock, CheckCircle, XCircle, PauseCircle } from 'lucide-react';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [ApplicationStatus.PENDING]: {
      label: 'Pending Review',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconClassName: 'text-yellow-600'
    },
    [ApplicationStatus.ACCEPTED]: {
      label: 'Accepted',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200',
      iconClassName: 'text-green-600'
    },
    [ApplicationStatus.REJECTED]: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
      iconClassName: 'text-red-600'
    },
    [ApplicationStatus.WITHDRAWN]: {
      label: 'Withdrawn',
      icon: PauseCircle,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      iconClassName: 'text-gray-600'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${config.className}`}>
      <Icon className={`h-3.5 w-3.5 ${config.iconClassName}`} />
      {config.label}
    </span>
  );
};

export default ApplicationStatusBadge;
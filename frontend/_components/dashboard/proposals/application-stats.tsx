"use client";

import { Target, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationStatsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export const ApplicationStats: React.FC<ApplicationStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: Target,
      color: 'text-gray-900',
      iconColor: 'text-gray-400'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      iconColor: 'text-yellow-400'
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-600',
      iconColor: 'text-green-400'
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      iconColor: 'text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
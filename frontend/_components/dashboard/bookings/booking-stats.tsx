"use client";

import React from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types/booking';

interface BookingStatsProps {
  bookings: Booking[];
}

export const BookingStats: React.FC<BookingStatsProps> = ({ bookings }) => {
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    inProgress: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    disputed: bookings.filter(b => b.status === 'disputed').length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + (booking.agreed_budget || 0), 0);

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.total,
      icon: TrendingUp,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Ready to start',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'bg-orange-500',
      description: 'Work ongoing',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Successfully finished',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'bg-red-500',
      description: 'Cancelled bookings',
    },
    {
      label: 'Total Revenue',
      value: `GHS ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'From completed jobs',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              )}
              {stat.trend && (
                <p className="text-xs text-green-600 font-medium mt-1">{stat.trend}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
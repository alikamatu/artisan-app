import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Star,
  PlayCircle 
} from 'lucide-react';
import { BookingStats as BookingStatsType } from '@/lib/types/booking-management.ts';

interface BookingStatsProps {
  stats: BookingStatsType;
  userRole: 'client' | 'worker';
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

export const BookingStats: React.FC<BookingStatsProps> = ({ stats, userRole }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total"
        value={stats.total}
        icon={Package}
        color="text-gray-900"
        bgColor="bg-blue-100"
      />
      
      <StatCard
        title="Active"
        value={stats.active}
        icon={Clock}
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
      
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={CheckCircle}
        color="text-green-600"
        bgColor="bg-green-100"
      />
      
      <StatCard
        title="Revenue"
        value={`GHS ${stats.totalRevenue.toLocaleString()}`}
        icon={TrendingUp}
        color="text-purple-600"
        bgColor="bg-purple-100"
      />
      
      {userRole === 'worker' && (
        <StatCard
          title="Avg Rating"
          value={`${stats.avgRating.toFixed(1)}/5`}
          icon={Star}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
      )}
    </div>
  );
};
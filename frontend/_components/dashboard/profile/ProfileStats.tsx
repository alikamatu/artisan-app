import React from 'react';
import { MdStar, MdWork, MdAssignment, MdBarChart } from 'react-icons/md';

interface ProfileStatsProps {
  profile: {
    role: 'client' | 'worker';
    rating?: number;
    totalJobs?: number;
    completedJobs?: number;
    totalJobsPosted?: number;
    averageRating?: number;
  };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const statsData = profile.role === 'worker' 
    ? [
        { icon: <MdStar className="text-amber-500 text-lg" />, value: profile.rating?.toFixed(1) || '4.5', label: 'Rating' },
        { icon: <MdAssignment className="text-emerald-500 text-lg" />, value: profile.completedJobs || 0, label: 'Completed' },
        { icon: <MdWork className="text-blue-500 text-lg" />, value: profile.totalJobs || 0, label: 'Total Jobs' }
      ]
    : [
        { icon: <MdStar className="text-amber-500 text-lg" />, value: profile.averageRating?.toFixed(1) || '4.2', label: 'Rating' },
        { icon: <MdWork className="text-blue-500 text-lg" />, value: profile.totalJobsPosted || 0, label: 'Jobs Posted' }
      ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MdBarChart className="text-purple-500" />
        Performance Stats
      </h3>
      <div className={`grid ${profile.role === 'worker' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
        {statsData.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center gap-1 mb-2">
              {stat.icon}
              <p className="font-bold text-gray-900 text-xl">{stat.value}</p>
            </div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

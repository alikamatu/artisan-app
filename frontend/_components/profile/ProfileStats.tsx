import React from 'react';

interface ProfileStatsProps {
  profile: any;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-blue-50 rounded-lg p-3 text-center">
        <div className="text-xl font-bold text-blue-700">{profile.totalJobs || 0}</div>
        <div className="text-xs text-gray-600">Total Jobs</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3 text-center">
        <div className="text-xl font-bold text-blue-700">{profile.completedJobs || 0}</div>
        <div className="text-xs text-gray-600">Completed</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3 text-center">
        <div className="text-xl font-bold text-blue-700">96%</div>
        <div className="text-xs text-gray-600">Success Rate</div>
      </div>
    </div>
  );
}
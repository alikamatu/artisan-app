import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-gray-600 text-lg">Loading your bookings...</p>
  </div>
);
import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { Booking } from '@/lib/types/booking';

interface BookingTimelineProps {
  booking: Booking;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ booking }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    const start = new Date(booking.start_date).getTime();
    const expected = new Date(booking.expected_completion_date).getTime();
    const now = new Date().getTime();
    
    if (now >= expected) return 100;
    if (now <= start) return 0;
    
    return Math.round(((now - start) / (expected - start)) * 100);
  };

  const progress = calculateProgress();

  return (
    <>
      {/* Progress Bar */}
      {(booking.status === 'active') && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            Start Date
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatDate(booking.start_date)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">
            Expected Completion
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatDate(booking.expected_completion_date)}
          </p>
        </div>
        
        {booking.actual_completion_date && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
              Completed On
            </p>
            <p className="text-sm font-bold text-green-900">
              {formatDate(booking.actual_completion_date)}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
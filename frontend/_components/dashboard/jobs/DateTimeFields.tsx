"use client";

import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { DURATION_OPTIONS } from '@/constants/jobConstants';

interface DateTimeFieldsProps {
  startDate: string;
  duration: string;
  onStartDateChange: (date: string) => void;
  onDurationChange: (duration: string) => void;
}

const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  startDate,
  duration,
  onStartDateChange,
  onDurationChange
}) => {
  return (
    <div className="space-y-4">
      {/* Start Date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4" />
          Preferred Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Clock className="h-4 w-4" />
          Estimated Duration
        </label>
        <select
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select duration</option>
          {DURATION_OPTIONS.map((duration) => (
            <option key={duration} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateTimeFields;
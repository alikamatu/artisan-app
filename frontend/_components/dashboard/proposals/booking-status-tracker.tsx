"use client";

import React from 'react';
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import { JobApplication } from '@/lib/types/applications';

interface BookingStatusTrackerProps {
  application: JobApplication;
}

export const BookingStatusTracker: React.FC<BookingStatusTrackerProps> = ({
  application
}) => {
  const booking = application.booking;
  
  if (!booking) return null;

  const statusSteps = [
    { 
      key: 'confirmed', 
      label: 'Booking Confirmed', 
      icon: CheckCircle,
      completed: ['confirmed', 'in_progress', 'completed'].includes(booking.status)
    },
    { 
      key: 'in_progress', 
      label: 'Work Started', 
      icon: Clock,
      completed: ['in_progress', 'completed'].includes(booking.status)
    },
    { 
      key: 'completed', 
      label: 'Work Completed', 
      icon: CheckCircle,
      completed: booking.status === 'completed'
    },
    { 
      key: 'rated', 
      label: 'Rated', 
      icon: CheckCircle,
      completed: booking.status === 'completed' && booking.rating !== null
    }
  ];

  if (booking.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600" />
          <div>
            <h4 className="font-medium text-red-900">Booking Cancelled</h4>
            <p className="text-sm text-red-700 mt-1">
              This booking has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-4">Booking Progress</h4>
      <div className="space-y-3">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.completed;
          const isLast = index === statusSteps.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isActive ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-6 ${
                      isActive ? 'bg-green-300' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {booking.start_date && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Start Date:</span>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(booking.start_date).toLocaleDateString()}
              </p>
            </div>
            {booking.completion_date && (
              <div>
                <span className="text-gray-600">Completed:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date(booking.completion_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
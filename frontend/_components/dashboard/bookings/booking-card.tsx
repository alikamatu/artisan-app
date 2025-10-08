"use client";

import React from 'react';
import { 
  Star, 
  Calendar, 
  User, 
  DollarSign, 
  Clock, 
  MapPin, 
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types/booking';

interface BookingCardProps {
  booking: Booking;
  onActionClick: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onActionClick }) => {
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'active':
        return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock, label: 'Active' };
      case 'active':
        return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertCircle, label: 'In Progress' };
      case 'completed':
        return { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Completed' };
      case 'cancelled':
        return { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: 'Cancelled' };
      case 'disputed':
        return { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertCircle, label: 'Disputed' };
      default:
        return { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const getActionButtonText = () => {
    switch (booking.status) {
      case 'active': return 'Mark Complete';
      case 'completed': return booking.rating ? 'View Rating' : 'Rate Worker';
      case 'cancelled': return 'View Details';
      case 'disputed': return 'Resolve Issue';
      default: return 'Manage';
    }
  };

  const canRate = booking.status === 'completed' && !booking.rating;
  const canMarkComplete = booking.status === 'active';
  const canStartWork = booking.status === 'active';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
              {booking.job?.title || 'Untitled Job'}
            </h3>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusConfig.color}`}>
              <StatusIcon className="h-3 w-3" />
              <span className="text-sm font-medium">{statusConfig.label}</span>
            </div>
          </div>
          
          <button
            onClick={onActionClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Worker Info */}
        <div className="flex items-center gap-3">
          {booking.worker?.profile_photo ? (
            <img
              src={booking.worker.profile_photo}
              alt={booking.worker.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{booking.worker?.name || 'Unknown Worker'}</p>
            {booking.worker?.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{booking.worker.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        {/* Budget */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Agreed Budget</span>
          </div>
          <span className="font-semibold text-gray-900">GHS {booking.agreed_budget}</span>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Start Date</span>
          </div>
          <span className="font-medium text-gray-900">
            {new Date(booking.start_date).toLocaleDateString()}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">End Date</span>
          </div>
          <span className="font-medium text-gray-900">{booking.expected_completion_date}</span>
        </div>

        {/* Location */}
        {booking.job?.location && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Location</span>
            </div>
            <span className="font-medium text-gray-900 text-right">
              {booking.job.location}
            </span>
          </div>
        )}

        {/* Rating Display */}
        {booking.rating && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm">Your Rating</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (booking.rating?.overall_rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="font-medium text-gray-900 ml-1">
                {booking.rating.overall_rating}/5
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onActionClick}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            canRate
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : canMarkComplete
              ? 'bg-green-500 text-white hover:bg-green-600'
              : canStartWork
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {getActionButtonText()}
        </button>
      </div>
    </div>
  );
};
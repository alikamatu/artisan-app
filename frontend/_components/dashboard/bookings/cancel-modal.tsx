"use client";

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

interface CancelModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (id: string, reason: string) => Promise<void>;
  bookingId: string;
  userRole: 'client' | 'worker';
}

export const CancelModal: React.FC<CancelModalProps> = ({
  show,
  onClose,
  onSubmit,
  bookingId,
  userRole
}) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleSubmit = async () => {
    await onSubmit(bookingId, cancelReason);
    onClose();
    setCancelReason('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
            <p className="text-gray-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this booking? The {userRole === 'client' ? 'worker' : 'client'} will be notified.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for cancellation *
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please explain why you're canceling this booking..."
            rows={4}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
          >
            Keep Booking
          </button>
          <button
            onClick={handleSubmit}
            disabled={!cancelReason.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-red-100 rounded-lg">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-red-900 text-lg mb-2">Failed to load bookings</h4>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);
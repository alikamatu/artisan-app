import React, { useState } from 'react';
import { Flag } from 'lucide-react';

interface IssueModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (id: string, reason: string) => Promise<void>;
  bookingId: string;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  show,
  onClose,
  onSubmit,
  bookingId
}) => {
  const [issueReason, setIssueReason] = useState('');

  const handleSubmit = async () => {
    await onSubmit(bookingId, issueReason);
    onClose();
    setIssueReason('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flag className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Report Issue</h3>
            <p className="text-gray-600 text-sm">Notify about a problem with this job</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe the issue *
          </label>
          <textarea
            value={issueReason}
            onChange={(e) => setIssueReason(e.target.value)}
            placeholder="Please describe the problem you're facing with this job..."
            rows={4}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!issueReason.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};
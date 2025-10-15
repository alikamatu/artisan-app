"use client";

import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '@/lib/types/applications';
import { useApplicationActions } from '@/lib/hooks/useApplications';
import { MoreVertical, Trash2, Edit3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplicationActionsProps {
  application: JobApplication;
  onStatusUpdate: () => void;
}

const ApplicationActions: React.FC<ApplicationActionsProps> = ({ 
  application, 
  onStatusUpdate 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { withdrawApplication, isLoading } = useApplicationActions();

  const canWithdraw = application.status === ApplicationStatus.PENDING;

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id);
      onStatusUpdate();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-10 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          >
            {canWithdraw && (
              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Withdraw Application
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              View Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationActions;
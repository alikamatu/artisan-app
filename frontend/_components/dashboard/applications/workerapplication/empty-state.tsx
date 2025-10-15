"use client";

import React from 'react';
import { FileText, Search } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {hasFilters ? (
          <Search className="h-8 w-8 text-gray-400" />
        ) : (
          <FileText className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasFilters ? 'No matching applications' : 'No applications yet'}
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {hasFilters
          ? 'Try adjusting your filters to see more results.'
          : 'Start applying to jobs to see your applications here.'}
      </p>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
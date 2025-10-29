import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FeedFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All Work' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'repairs', label: 'Repairs' },
  { value: 'other', label: 'Other' }
];

export function FeedFilters({ selectedCategory, onCategoryChange }: FeedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="absolute bottom-6 right-6 z-30 p-3 bg-white text-gray-800 rounded-full hover:bg-gray-50 shadow-lg transition-all pointer-events-auto"
      >
        <Filter className="h-6 w-6" />
      </button>

      {/* Filters Modal */}
      {showFilters && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 text-xl font-bold">Filter Work</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => {
                    onCategoryChange(category.value);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import React from 'react';
import { Search, Grid3X3 } from 'lucide-react';
import Link from 'next/link';

interface FeedHeaderProps {
  currentIndex: number;
  totalItems: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['all', 'renovation', 'electrical', 'plumbing', 'carpentry', 'painting', 'cleaning', 'gardening'];

export function FeedHeader({ 
  currentIndex, 
  totalItems, 
  selectedCategory,
  onCategoryChange 
}: FeedHeaderProps) {
  const formatCategory = (category: string) => {
    if (category === 'all') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pt-4 px-4 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between py-3">
        {/* Logo/Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="text-gray-900 text-xl font-bold"
          >
            WorkShow
          </Link>
          
          {/* Progress Indicator */}
          {totalItems > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{currentIndex + 1}</span>
              <span>/</span>
              <span>{totalItems}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          <Link 
            href="/profile?tab=portfolio"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Grid3X3 className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>
    </div>
  );
}
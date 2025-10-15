"use client";

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { JobCategory } from '@/lib/types/jobs';
import { JOB_CATEGORIES, getCategoriesBySearch } from '@/constants/jobConstants';

interface CategorySelectorProps {
  value: JobCategory | '';
  onChange: (category: JobCategory) => void;
  error?: string;
  disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return Object.values(JOB_CATEGORIES);
    return getCategoriesBySearch(searchTerm);
  }, [searchTerm]);

  const selectedCategory = value ? JOB_CATEGORIES[value] : null;

  const handleCategorySelect = (category: JobCategory) => {
    onChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('' as JobCategory);
  };

  const getIconComponent = (iconName: string) => {
    // Map icon names to actual components - you'll need to import these
    const iconMap: Record<string, React.ReactNode> = {
      'wrench': '🔧',
      'zap': '⚡',
      'book-open': '📚',
      'sparkles': '✨',
      'hammer': '🔨',
      'palette': '🎨',
      'leaf': '🌿',
      'tools': '🛠️',
      'truck': '🚛',
      'monitor': '💻',
      'heart': '❤️',
      'car': '🚗',
      'scissors': '✂️',
      'dumbbell': '🏋️',
      'calendar': '📅',
      'camera': '📷',
      'pen-tool': '✏️',
      'globe': '🌍',
      'scale': '⚖️',
      'calculator': '🧮',
      'more-horizontal': '⚫'
    };
    return iconMap[iconName] || '⚫';
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        📋 Job Category *
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedCategory ? (
                <>
                  <span className="text-lg">{getIconComponent(selectedCategory.icon)}</span>
                  <div>
                    <div className="font-medium">{selectedCategory.name}</div>
                    <div className="text-sm text-gray-500 truncate">{selectedCategory.description}</div>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">Select a job category</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedCategory && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection(e);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </span>
              )}
              {!disabled && (
                isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      value === category.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getIconComponent(category.icon)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Skills: {category.commonSkills.slice(0, 3).join(', ')}
                          {category.commonSkills.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <div>No categories found</div>
                  <div className="text-sm">Try a different search term</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {selectedCategory && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">Common skills for {selectedCategory.name}:</div>
            <div className="flex flex-wrap gap-1">
              {selectedCategory.commonSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
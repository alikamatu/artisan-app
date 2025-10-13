import React from 'react';
import { User, Star, Briefcase } from 'lucide-react';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: 'overview' | 'reviews' | 'portfolio') => void;
}

export default function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    // { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase }
  ] as const;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
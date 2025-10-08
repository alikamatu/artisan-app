import React from 'react';
import { MessageCircle, Briefcase, Edit, LogOut } from 'lucide-react';
import Link from 'next/link';

interface ActionButtonsProps {
  isOwnProfile: boolean;
  isWorker: boolean;
  onLogout: () => void;
}

export default function ActionButtons({ isOwnProfile, isWorker, onLogout }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {!isOwnProfile && (
        <>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Message</span>
          </button>
          {isWorker && (
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Hire</span>
            </button>
          )}
        </>
      )}
      
      {isOwnProfile && (
        <>
          <Link 
            href="/settings/profile"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
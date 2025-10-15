"use client";

import React, { useEffect } from 'react';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import { getDisplayName, getInitials } from '@/helpers/job-helpers';
import { UserProfileLink } from '@/_components/common/UserProfileLink';

interface WorkerInfoProps {
  worker: any;
}

export const WorkerInfo: React.FC<WorkerInfoProps> = ({ worker }) => {

  useEffect(() => {
    console.log(worker);
    
  }, [worker]);

  if (!worker) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">?</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Unknown Worker</p>
          <p className="text-gray-600 text-sm">Information unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {worker.profile_photo ? (
        <img
          src={worker.profile_photo}
          alt={worker.display_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            kjhrljgkf
            <UserProfileLink userId={worker.id} userName={getDisplayName(worker)} className="sr-only" />
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">
            {worker.display_name || worker.name}
          </p>
          {worker.verification_status === 'verified' && (
            <BadgeCheck className="h-4 w-4 text-blue-500" />
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {worker.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{worker.rating}</span>
            </div>
          )}
          
          {worker.location && (
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {worker.serviceArea}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
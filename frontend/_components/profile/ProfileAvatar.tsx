import React from 'react';
import { BadgeCheck, Camera } from 'lucide-react';

interface ProfileAvatarProps {
  profile: any;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export default function ProfileAvatar({ profile, isOwnProfile = false, onEdit }: ProfileAvatarProps) {
  return (
    <div className="relative">
      <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
        {profile.profilePhoto ? (
          <img 
            src={profile.profilePhoto} 
            alt={profile.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          profile.name?.charAt(0).toUpperCase() || 'U'
        )}
        
        {isOwnProfile && (
          <button
            onClick={onEdit}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <Camera className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
      
      {profile.isVerified && (
        <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1.5">
          <BadgeCheck className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
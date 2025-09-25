"use client";

import React from 'react';
import Link from 'next/link';

interface UserProfileLinkProps {
  userId?: string;
  userName: string;
  userPhoto?: string;
  showPhoto?: boolean;
  className?: string;
  profile_photo?: string;
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userId,
  userName,
  userPhoto,
  showPhoto = true,
  className = ''
}) => {
  return (
    <Link 
      href={`/dashboard/profile/${userId}`}
      className={`inline-flex items-center gap-2 hover:text-blue-600 transition-colors ${className}`}
    >
      {showPhoto && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {userPhoto ? (
            <img 
              src={userPhoto} 
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
      )}
      <span className="font-medium">{userName}</span>
    </Link>
  );
};

"use client";

import React, { useState } from 'react';
import { 
  MdEdit, MdVerified, MdBusiness, MdPerson, MdLocationOn
} from 'react-icons/md';

// ProfileHeader Component
interface ProfileHeaderProps {
  profile: {
    name?: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      photo?: string;
      businessName?: string;
    };
    role: 'client' | 'worker';
    isVerified?: boolean;
    company?: string;
    region?: string;
    verification?: {
      verification_status?: string;
    };
  };
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEdit,
}) => {
  let displayName = 'User';
  
  if (profile.name) {
    displayName = profile.name;
  } else if (profile.profile?.firstName || profile.profile?.lastName) {
    const firstName = profile.profile?.firstName || '';
    const lastName = profile.profile?.lastName || '';
    displayName = `${firstName} ${lastName}`.trim();
  }
      
  const profilePhoto = profile.profile?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  const businessName = profile.profile?.businessName || profile.company;
  const isVerified = profile.isVerified || profile.verification?.verification_status === 'verified';

  const getRoleIcon = () => {
    return profile.role === 'worker' ? <MdBusiness className="text-sm" /> : <MdPerson className="text-sm" />;
  };

  const getVerificationStatus = () => {
    const status = profile.verification?.verification_status;
    switch (status) {
      case 'verified':
        return { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'pending':
        return { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'rejected':
        return { label: 'Verification Failed', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return isVerified ? { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' } : 
        { label: 'Not Verified', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-32 bg-transparent">
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute bottom-4 left-6">
          <h2 className="text-white text-sm font-medium">Profile</h2>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-center -mt-20">
          <div className="relative group">
            <img
              src={profilePhoto}
              alt={displayName}
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg z-10"
            />
            <button
              onClick={onEdit}
              className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-20"
            >
              <MdEdit className="text-lg" />
            </button>
          </div>

          <div className="flex-grow items-center text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
              <h1 className="text-sm font-bold text-gray-900">{displayName}</h1>
              {isVerified && <MdVerified className="text-blue-500 text-xl" />}
            
            </div>

            {businessName && (
              <p className="text-gray-700 font-medium mb-1 flex items-center justify-center sm:justify-start gap-1">
                <MdBusiness className="text-purple-500" />
                {businessName}
              </p>
            )}

                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${profile.role === 'worker' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}>
                  {getRoleIcon()}
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${verificationStatus.color}`}>
                  {verificationStatus.label}
                </span>
              </div>

            {profile.region && (
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                <MdLocationOn className="text-gray-400" />
                {profile.region}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
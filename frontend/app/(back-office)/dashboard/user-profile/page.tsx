"use client";

import React, { useState } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ProfileHeader } from '@/_components/dashboard/profile/ProfileHeader';
import { ProfileStats } from '@/_components/dashboard/profile/ProfileStats';
import { ProfileInfo } from '@/_components/dashboard/profile/ProfileInfo';
import { EditProfileDialog } from '@/_components/dashboard/profile/EditProfileDialog';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function UserProfilePage() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const {logout} = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-2">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto py-4">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex justify-between text-sm text-gray-600 mb-8">
            <div className="flex">
            <Link href="/" className="hover:text-purple-600 transition-all duration-300 flex items-center gap-1">
             Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Profile</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-all duration-300" onClick={() => {
          logout();
        }}>
          <span className="text-gray-900 font-medium hover:text-red-600 transition-all duration-300 flex items-center gap-2"><MdLogout /> Sign Out</span>
        </div>

        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <ProfileHeader
              profile={profile}
              onEdit={() => setEditDialogOpen(true)}
            />
            <ProfileStats profile={profile} />
          </div>

            <EditProfileDialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              profile={{
                ...profile,
                financial: profile.financial
                  ? {
                      ...profile.financial,
                      routing_number:
                        profile.financial.routing_number ?? undefined,
                      bank_name:
                        profile.financial.bank_name ?? undefined,
                    }
                  : undefined,
              }}
              onSave={updateProfile}
            />

          {/* Right Column */}
          <div className="w-full lg:w-2/3">
            <ProfileInfo
              profile={{
                ...profile,
                financial: profile.financial
                  ? {
                      ...profile.financial,
                      bank_name: profile.financial.bank_name ?? undefined,
                    }
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
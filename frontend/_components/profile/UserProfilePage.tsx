"use client";

import React, { useState } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import ProfileHeader from './ProfileHeader';
import ProfileNavigation from './ProfileNavigation';
import OverviewTab from './tabs/OverviewTab';
import ActivityTab from './tabs/ActivityTab';
import ReviewsTab from './tabs/ReviewsTab';
import PortfolioTab from './tabs/PortfolioTab';
import { EditProfileDialog } from './EditProfileDialog'


interface ProfilePageProps {
  isOwnProfile?: boolean;
  userId?: string;
}

export default function ProfilePage({ isOwnProfile = false, userId }: ProfilePageProps) {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'portfolio' | 'activity'>('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { logout } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={isOwnProfile ? "/dashboard" : "/"}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-sm text-gray-600 hover:text-blue-600">
                  {isOwnProfile ? "← Dashboard" : "← Back"}
                </span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Profile</span>
                {isOwnProfile && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    Your Profile
                  </span>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditDialogOpen(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProfileHeader 
            profile={profile} 
            isOwnProfile={isOwnProfile}
            onEdit={() => setEditDialogOpen(true)}
          />

          {/* Navigation Tabs */}
          <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'activity' && (
          <ActivityTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'portfolio' && (
          <PortfolioTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
      </div>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
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
      )}
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { usePublicProfile } from '@/lib/hooks/usePublicProfile';
import ProfileNavigation from '@/_components/profile/ProfileNavigation';
import OverviewTab from '@/_components/profile/tabs/OverviewTab';
import PortfolioTab from '@/_components/profile/tabs/PortfolioTab';
import LoadingState from '@/_components/profile/LoadingState';
import ErrorState from '@/_components/profile/ErrorState';
import ProfileHeader from '@/_components/profile/ProfileHeader';
import ReviewsTab from '@/_components/profile/tabs/ReviewsTab';
import MyJobsTab from '@/_components/profile/tabs/MyJobsTab'; // ADD THIS IMPORT
import Link from 'next/link';

interface ProfilePageProps {
  userId: string;
  isOwnProfile?: boolean;
}

export default function ProfilePage({ userId, isOwnProfile = false }: ProfilePageProps) {
  const { profile, loading, error } = usePublicProfile(userId);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'portfolio' | 'my-jobs'>('overview');

  if (loading) {
    return <LoadingState />;
  }

  if (error || !profile) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600 hover:text-blue-600">← Back</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
          <ProfileNavigation profile={profile} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2">
        {activeTab === 'overview' && (
          <OverviewTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'portfolio' && (
          <PortfolioTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
        {activeTab === 'my-jobs' && ( // ADD THIS TAB
          <MyJobsTab profile={profile} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </div>
  );
}
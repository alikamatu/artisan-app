import UserProfileView from '@/_components/profile/UserProfileView';
import React from 'react';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <UserProfileView 
      userId={params.userId}
      isCurrentUser={false} // You can determine this based on auth state
    />
  );
}
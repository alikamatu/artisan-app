import ProfilePage from './ProfilePage';
import React from 'react';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;
  
  return <ProfilePage userId={userId} isOwnProfile={false} />;
}
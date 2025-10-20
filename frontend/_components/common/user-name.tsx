"use client";

import React from 'react';
import Link from 'next/link';

interface UserNameProps {
  userId?: string;
  userName: string;
  className?: string;
  profile_photo?: string;
}

export const UserName: React.FC<UserNameProps> = ({
  userId,
  userName,
  className = '',
}) => {
  return (
    <Link 
      href={`/dashboard/profile/${userId}`}
      className={`inline-flex items-center gap-2 hover:text-blue-600 transition-colors ${className}`}
    >
      {userName}
    </Link>
  );
};
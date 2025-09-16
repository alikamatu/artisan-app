"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import JobList from '@/_components/dashboard/jobs/JobList';

export default function MyJobsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/' + encodeURIComponent('/dashboard/user-profile/my-jobs'));
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await response.json();
      setCurrentUser(userData);
      
      // Check if user is a client
      if (userData.role !== 'client') {
        router.push('/dashboard/jobs');
        return;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      router.push('/sign-in?redirect=' + encodeURIComponent('/dashboard/user-profile/my-jobs'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">Only clients can view this page.</p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobList 
        showCreateButton={true}
        clientId={currentUser.id}
        title="My Posted Jobs"
        subtitle="Manage and track your job postings"
      />
    </div>
  );
}
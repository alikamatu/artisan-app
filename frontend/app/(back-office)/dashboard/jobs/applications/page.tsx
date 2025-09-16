"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import WorkerApplicationsView from '@/_components/dashboard/applications/WorkerApplicationsView';
import ClientApplicationsView from '@/_components/dashboard/applications/ClientApplicationsView';

export default function ApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'worker' && <WorkerApplicationsView user={user} />}
        {user.role === 'client' && <ClientApplicationsView user={user} />}
        
        {/* Role not supported */}
        {!['worker', 'client'].includes(user.role) && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              Applications management is available for workers and clients only.
              Your current role is: <span className="font-medium capitalize">{user.role}</span>
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowUpRight className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
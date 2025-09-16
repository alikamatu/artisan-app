"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateJobForm from '@/_components/dashboard/jobs/CreateJobForm';

export default function CreateJobPage() {
  const router = useRouter();

  const handleSuccess = (jobId: string) => {
    // Redirect to the newly created job with success message
    router.push(`/dashboard/jobs/${jobId}?created=true`);
  };

  const handleCancel = () => {
    // Go back to jobs list
    router.push('/dashboard/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Post a New Job
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with skilled professionals across Ghana. Our enhanced job posting system 
              makes it easy to find the right person for your needs.
            </p>
          </div>
          
          {/* Quick Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Tips for a successful job post:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about your requirements and expectations</li>
              <li>• Choose the right category to reach relevant professionals</li>
              <li>• Set a fair budget range based on the work complexity</li>
              <li>• Include your exact location for better local matches</li>
              <li>• Add specific skills needed for more targeted applications</li>
            </ul>
          </div>
        </div>

        {/* Enhanced Create Job Form */}
        <CreateJobForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-sm text-gray-600">
                  Our system matches your job with professionals based on category, 
                  location, skills, and availability preferences.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ghana-Wide Coverage</h3>
                <p className="text-sm text-gray-600">
                  Post jobs across all 16 regions of Ghana with detailed location 
                  targeting for better local connections.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                <p className="text-sm text-gray-600">
                  Filter by ratings, reviews, and verification status to find 
                  trusted professionals for your projects.
                </p>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Job Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'Plumbing', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
                { name: 'Electrical', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
                { name: 'Cleaning', icon: '✨', color: 'bg-green-100 text-green-800' },
                { name: 'Tutoring', icon: '📚', color: 'bg-purple-100 text-purple-800' },
                { name: 'Carpentry', icon: '🔨', color: 'bg-orange-100 text-orange-800' },
                { name: 'Tech Support', icon: '💻', color: 'bg-indigo-100 text-indigo-800' }
              ].map((category) => (
                <div
                  key={category.name}
                  className={`${category.color} px-3 py-2 rounded-lg text-sm font-medium text-center`}
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div>{category.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 mt-0.5">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-medium text-amber-900 mb-1">Safety Guidelines</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Always verify professional credentials and reviews</li>
                  <li>• Meet in safe, public places for initial consultations</li>
                  <li>• Use our secure payment system for transactions</li>
                  <li>• Report any suspicious activity to our support team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

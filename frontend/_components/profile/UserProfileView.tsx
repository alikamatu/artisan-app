"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle, 
  Briefcase, 
  Mail, 
  Phone, 
  Shield,
  Clock,
  DollarSign,
  Navigation,
  Building,
  FileText,
  ThumbsUp,
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { usePublicProfile } from '@/lib/hooks/usePublicProfile';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

interface UserProfileViewProps {
  userId: string;
  isCurrentUser?: boolean;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ 
  userId, 
  isCurrentUser = false 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'portfolio'>('overview');
  
  // Use public profile hook for target user
  const { profile: targetProfile, loading, error, refetch } = usePublicProfile(userId);
  
  // Use current user profile only for comparison
  const { profile: currentUserProfile } = useUserProfile();
  
  // Determine if viewing own profile
  const isOwnProfile = currentUserProfile?.id === userId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

    if (!targetProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Available</h3>
          <p className="text-gray-600">Unable to load user profile.</p>
        </div>
      </div>
    );
  }


  const isWorker = targetProfile.role === 'worker';
  const verificationLevel = targetProfile.verificationLevel || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {targetProfile.profilePhoto ? (
                  <img 
                    src={targetProfile.profilePhoto} 
                    alt={targetProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  targetProfile.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              {verificationLevel > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{targetProfile.name}</h1>
                    {isOwnProfile && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{targetProfile.bio || 'No bio provided'}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{targetProfile.rating || '4.5'}</span>
                      <span>({targetProfile.totalJobs || 0} jobs)</span>
                    </div>

                    {/* Location */}
                    {targetProfile.region && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{targetProfile.region}</span>
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Joined {new Date(targetProfile.createdAt).getFullYear()}</span>
                    </div>

                    {/* Role Badge */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isWorker 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isWorker ? 'Worker' : 'Client'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!isOwnProfile && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Message
                      </button>
                      {isWorker && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Briefcase className="h-4 w-4 inline mr-2" />
                          Hire
                        </button>
                      )}
                    </>
                  )}
                  {isOwnProfile && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-b">
            <nav className="flex space-x-8">
              {['overview', 'reviews', 'portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab profile={targetProfile} isWorker={isWorker} />}
        {activeTab === 'reviews' && <ReviewsTab profile={targetProfile} />}
        {activeTab === 'portfolio' && <PortfolioTab profile={targetProfile} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ profile: any; isWorker: boolean }> = ({ profile, isWorker }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            About
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {profile.description || profile.bio || 'No description provided.'}
          </p>
        </div>

        {/* Skills & Services Section */}
        {(profile.skills?.length > 0 || profile.services?.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              {isWorker ? 'Skills & Services' : 'Services Needed'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
              {profile.services?.map((service: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

 {isWorker && (profile.experience || profile.education || profile.certifications?.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-500" />
              Professional Background
            </h2>
            <div className="space-y-4">
              {profile.experience && (
                <div>
                  <h3 className="font-medium text-gray-900">Experience</h3>
                  <p className="text-gray-600 mt-1">{profile.experience}</p>
                </div>
              )}
              {profile.education && (
                <div>
                  <h3 className="font-medium text-gray-900">Education</h3>
                  <p className="text-gray-600 mt-1">{profile.education}</p>
                </div>
              )}
              {profile.certifications?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900">Certifications</h3>
                  <div className="mt-2 space-y-1">
                    {profile.certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Sidebar */}
      <div className="space-y-6">
        {/* Verification Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Verification Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Verified</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Phone Verified</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            {profile.verificationLevel > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ID Verified</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
        </div>

        {/* Work Details */}
        {isWorker && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Work Details
            </h3>
            <div className="space-y-3">
              {profile.hourlyRate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-green-600">
                    GHS {profile.hourlyRate}
                  </span>
                </div>
              )}
              {profile.serviceArea && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="h-4 w-4" />
                  <span>Service Area: {profile.serviceArea}</span>
                </div>
              )}
              {profile.maxDistance && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Max Distance: {profile.maxDistance}km</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Stats */}
        {!isWorker && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              Client Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Jobs Posted</span>
                <span className="font-semibold">{profile.totalJobsPosted || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{profile.averageRating || '4.2'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Info</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reviews Tab Component
const ReviewsTab: React.FC<{ profile: any }> = ({ profile }) => {
  // Mock reviews data - replace with actual API call
  const reviews = [
    {
      id: 1,
      reviewer: { name: 'John Doe', rating: 4.5 },
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time.',
      date: '2024-01-15',
      job: 'Plumbing Repair'
    },
    {
      id: 2,
      reviewer: { name: 'Sarah Smith', rating: 4.8 },
      rating: 4,
      comment: 'Good quality work, but was a bit late.',
      date: '2024-01-10',
      job: 'Electrical Installation'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-green-500" />
          Reviews & Ratings
        </h2>
      </div>
      
      <div className="divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{review.rating}/5</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <span className="text-sm text-blue-600">Job: {review.job}</span>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Portfolio Tab Component
const PortfolioTab: React.FC<{ profile: any }> = ({ profile }) => {
  // Mock portfolio items - replace with actual API call
  const portfolioItems = [
    {
      id: 1,
      title: 'Kitchen Renovation',
      description: 'Complete kitchen remodeling project',
      image: '/api/placeholder/300/200',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Bathroom Installation',
      description: 'Modern bathroom fixture installation',
      image: '/api/placeholder/300/200',
      date: '2024-01-10'
    }
  ];

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          Portfolio
        </h2>
        <p className="text-gray-600 mt-1">Showcase of completed projects and work samples</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
          </div>
        ))}
        
        {portfolioItems.length === 0 && (
          <div className="col-span-full p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No portfolio items yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
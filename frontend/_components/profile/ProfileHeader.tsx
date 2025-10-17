import React from 'react';
import { MapPin, Calendar, BadgeCheck, MessageCircle, Briefcase, Star } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) {
  const isWorker = profile.role === 'worker';
  
  // Calculate real metrics from profile data
  const getWorkerMetrics = () => {
    if (!isWorker) return null;

    const professionalData = profile.metadata?.professional || {};
    const statsData = profile.metadata?.stats || {};
    
    return {
      rating: professionalData.rating || 0,
      totalJobs: statsData.completed_jobs || statsData.total_jobs || 0,
      totalReviews: statsData.total_reviews || 0,
      responseRate: professionalData.response_rate || 0,
      completionRate: professionalData.completion_rate || 0
    };
  };

  const workerMetrics = getWorkerMetrics();
  const hasRating = workerMetrics && workerMetrics.rating > 0;

  // Format region for display
  const formatRegion = (region: string) => {
    if (!region) return '';
    return region.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating) 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <ProfileAvatar profile={profile} isOwnProfile={isOwnProfile} />
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 truncate">
                {profile.display_name || profile.name}
              </h1>
              {profile.is_verified && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  Verified
                </div>
              )}
            </div>
            
            {profile.metadata?.business?.name && (
              <p className="text-lg text-gray-600 mb-3 font-medium">
                {profile.metadata.business.name}
              </p>
            )}
            
            {profile.metadata?.profile?.bio && (
              <p className="text-gray-700 mb-4 max-w-3xl leading-relaxed">
                {profile.metadata.profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Worker-specific metrics */}
              {isWorker && workerMetrics && (
                <>
                  {hasRating && (
                    <div className="flex items-center gap-2 px-4 py-2">
                      {renderStarRating(workerMetrics.rating)}
                      <span className="text-gray-600 text-sm">
                        ({workerMetrics.totalReviews} {workerMetrics.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {workerMetrics.totalJobs > 0 && (
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                      <Briefcase className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">{workerMetrics.totalJobs}</span>
                      <span className="text-green-700 text-sm">
                        {workerMetrics.totalJobs === 1 ? 'job completed' : 'jobs completed'}
                      </span>
                    </div>
                  )}

                  {workerMetrics.responseRate > 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">{workerMetrics.responseRate}%</span>
                      <span className="text-blue-700 text-sm">response rate</span>
                    </div>
                  )}
                </>
              )}

              {/* Location */}
              {profile.metadata?.pricing?.service_area && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.metadata.pricing.service_area}</span>
                </div>
              )}

              {/* Member since */}
              <div className="flex items-center text-xs gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Role badge */}
              <div className={`px-4 py-2 text-xs rounded-full font-semibold ${
                isWorker 
                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                  : 'bg-purple-50 text-purple-800 border-purple-200'
              }`}>
                {isWorker ? 'Service Provider' : 'Client'}
              </div>
            </div>
          </div>

          {/* Action Buttons for non-owners */}
          {!isOwnProfile && (
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 justify-center">
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
              {isWorker && (
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                  <Briefcase className="h-4 w-4" />
                  Hire
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
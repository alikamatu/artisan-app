import React from 'react';
import { MapPin, Calendar, BadgeCheck, MessageCircle, Briefcase } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) {
  const isWorker = profile.role === 'worker';

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <ProfileAvatar profile={profile} isOwnProfile={isOwnProfile} />
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 truncate">{profile.name}</h1>
              {profile.isVerified && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  Verified
                </div>
              )}
            </div>
            
            {profile.businessName && (
              <p className="text-lg text-gray-600 mb-3 font-medium">{profile.businessName}</p>
            )}
            
            {profile.bio && (
              <p className="text-gray-700 mb-4 max-w-3xl leading-relaxed">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4">
              {profile.rating > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-bold text-lg">{profile.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-600">
                    ({profile.totalJobs || 0} {profile.totalJobs === 1 ? 'job' : 'jobs'})
                  </span>
                </div>
              )}

              {profile.region && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.region}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>

              <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                isWorker ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isWorker ? 'Service Provider' : 'Client'}
              </div>
            </div>
          </div>

          {/* Action Buttons for non-owners */}
          {!isOwnProfile && (
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
              {isWorker && (
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
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
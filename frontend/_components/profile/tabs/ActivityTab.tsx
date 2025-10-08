import React from 'react';
import { TrendingUp, CheckCircle, Star, Edit, Users, Briefcase } from 'lucide-react';

interface ActivityTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function ActivityTab({ profile, isOwnProfile = false }: ActivityTabProps) {
  const activities = [
    {
      id: 1,
      type: 'job_completed',
      title: 'Completed a plumbing job',
      description: 'Successfully completed bathroom plumbing installation',
      timestamp: new Date().toISOString(),
      icon: CheckCircle,
    },
    {
      id: 2,
      type: 'review_received',
      title: 'Received 5-star review',
      description: 'Client left excellent feedback for recent work',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: Star,
    },
    ...(isOwnProfile ? [
      {
        id: 3,
        type: 'profile_updated',
        title: 'Updated portfolio',
        description: 'Added new project images to portfolio',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        icon: Edit,
      }
    ] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Recent Activity
        </h2>
        
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">Activity will appear here as you use the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
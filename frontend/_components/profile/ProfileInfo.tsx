import React from 'react';
import { Edit, Award, Briefcase, FileText, CheckCircle, Shield, Clock, MapPin } from 'lucide-react';

interface ProfileInfoProps {
  profile: any;
  onEdit: () => void;
}

export default function ProfileInfo({ profile, onEdit }: ProfileInfoProps) {
  const isWorker = profile.role === 'worker';

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Skills & Services */}
        {(profile.skills?.length > 0 || profile.services?.length > 0) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              {isWorker ? 'Skills & Services' : 'Services Needed'}
            </h3>
            <div className="space-y-3">
              {profile.skills?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.services?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Background */}
        {isWorker && (profile.experience || profile.education || profile.certifications?.length > 0) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              Professional Background
            </h3>
            <div className="space-y-4">
              {profile.experience && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Experience</h4>
                  <p className="text-gray-600 text-sm">{profile.experience}</p>
                </div>
              )}
              {profile.education && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Education</h4>
                  <p className="text-gray-600 text-sm">{profile.education}</p>
                </div>
              )}
              {profile.certifications?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {profile.certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Details */}
        {isWorker && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Work Details
            </h3>
            <div className="space-y-3">
              {profile.hourlyRate && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">Hourly Rate</span>
                  <span className="font-bold text-blue-700">GHS {profile.hourlyRate}</span>
                </div>
              )}
              {profile.serviceArea && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Service Area</div>
                    <div className="text-sm text-gray-900 font-medium">{profile.serviceArea}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            Verification Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Identity Verification</span>
              {profile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              ) : (
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">Pending</span>
              )}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Profile Completion</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((profile.verificationLevel || 0) / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(((profile.verificationLevel || 0) / 3) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { User, Award, Briefcase, Shield, Clock, MapPin, CheckCircle, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { useJobs } from '@/lib/hooks/useJob';
import { useBookings } from '@/lib/hooks/useBookings';

interface OverviewTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function OverviewTab({ profile, isOwnProfile = false }: OverviewTabProps) {
  const isWorker = profile.role === 'worker';
  
  // Fetch real data based on user role
  const { jobs: clientJobs, total: totalClientJobs } = useJobs(
    isWorker ? {} : { client_id: profile.id }
  );
  
  const { bookings: workerBookings, total: totalWorkerBookings } = useBookings(
    isWorker ? { worker_id: profile.id } : {}
  );

  // Calculate metrics from real data
  const calculateMetrics = () => {
    if (isWorker) {
      const completedBookings = workerBookings?.filter(
        (booking: any) => booking.status === 'completed'
      ).length || 0;
      
      const activeBookings = workerBookings?.filter(
        (booking: any) => booking.status === 'active'
      ).length || 0;

      const totalEarnings = workerBookings?.reduce((sum: number, booking: any) => {
        return booking.status === 'completed' ? sum + (booking.final_budget || 0) : sum;
      }, 0) || 0;

      const successRate = totalWorkerBookings > 0 
        ? Math.round((completedBookings / totalWorkerBookings) * 100)
        : 0;

      return {
        totalJobs: totalWorkerBookings,
        completedJobs: completedBookings,
        activeJobs: activeBookings,
        successRate,
        totalEarnings
      };
    } else {
      // Client metrics
      const activeJobs = clientJobs?.filter(
        (job: any) => job.status === 'active' || job.current_status === 'active'
      ).length || 0;

      const completedJobs = clientJobs?.filter(
        (job: any) => job.status === 'completed' || job.current_status === 'completed'
      ).length || 0;

      return {
        totalJobsPosted: totalClientJobs,
        activeJobs,
        completedJobs
      };
    }
  };

  const metrics = calculateMetrics();
  
  // Use the flat data structure from usePublicProfile
  const skills = profile.skills || [];
  const services = profile.services || [];
  const description = profile.description || '';
  const experience = profile.experience;
  const education = profile.education;
  const certifications = profile.certifications || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* About Section */}
        {description && (
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              About {isWorker ? 'Me' : 'Us'}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {/* Skills & Services Section */}
        {(skills.length > 0 || services.length > 0) && (
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              {isWorker ? 'Skills & Services' : 'Services Needed'}
            </h2>
            <div className="space-y-4">
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {services.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {isWorker ? 'Services Offered' : 'Services Needed'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience & Education */}
        {isWorker && (experience || education || certifications.length > 0) && (
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Professional Background
            </h2>
            <div className="space-y-4">
              {experience && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Experience
                  </h3>
                  <p className="text-gray-600 pl-6">{experience}</p>
                </div>
              )}
              {education && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Education
                  </h3>
                  <p className="text-gray-600 pl-6">{education}</p>
                </div>
              )}
              {certifications.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    Certifications
                  </h3>
                  <div className="space-y-2 pl-6">
                    {certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
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
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Verification Status */}
        <div className="bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Verification
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Identity Verified</span>
              {profile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              ) : (
                <span className="text-xs text-gray-400">Not verified</span>
              )}
            </div>
            
            {/* Private verification details for profile owner */}
            {isOwnProfile && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </>
            )}
            
            <div className="mt-3 pt-3">
              <div className="text-xs text-gray-500 mb-2">Verification Level</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((profile.verificationLevel || 0) / 3) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {profile.verificationLevel || 0}/3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Details */}
        {isWorker && (
          <div className="bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Work Details
            </h3>
            <div className="space-y-3">
              {profile.hourlyRate && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">Hourly Rate</span>
                  <span className="font-bold text-blue-700">
                    GHS {profile.hourlyRate}
                  </span>
                </div>
              )}
              {profile.serviceArea && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-500 text-xs">Service Area</div>
                    <div className="text-gray-900 font-medium">{profile.serviceArea}</div>
                  </div>
                </div>
              )}
              {profile.maxDistance && (
                <div className="flex items-start gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-500 text-xs">Max Distance</div>
                    <div className="text-gray-900 font-medium">{profile.maxDistance}km radius</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance
          </h3>
          <div className="space-y-3">
            {isWorker ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Jobs</span>
                  <span className="font-semibold text-gray-900">{metrics.totalJobs || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-gray-900">{metrics.completedJobs || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">{metrics.successRate || 0}%</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jobs Posted</span>
                  <span className="font-semibold text-gray-900">{metrics.totalJobsPosted || 0}</span>
                </div>
              </>
            )}
            
            {/* Private earnings for profile owner */}
            {isOwnProfile && isWorker && (
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-600">Total Earnings</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  GHS {metrics.totalEarnings ? metrics.totalEarnings.toLocaleString() : '0'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing icon
const Navigation = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
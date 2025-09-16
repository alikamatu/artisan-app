import React, { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSchedule, MdAttachMoney, MdSchool, MdAccountBalance, MdAssignment, MdCheckCircle, MdRadioButtonUnchecked, MdExpandMore, MdVerified, MdAccessTime, MdPayment, MdWork, MdPerson, MdBadge } from 'react-icons/md';

interface ProfileInfoProps {
  profile: {
    email: string;
    phone?: string;
    bio?: string;
    role: 'client' | 'worker';
    // Flattened nested data
    profile?: {
      address?: string;
      firstName?: string;
      lastName?: string;
      photo?: string;
      businessName?: string;
    };
    professional?: {
      services?: string[];
      skills?: string[];
      experience?: string;
      description?: string;
      education?: string;
      certifications?: string[];
    };
    pricing?: {
      hourly_rate?: number;
      service_area?: string;
      max_distance?: number;
      working_hours?: {
        start: string;
        end: string;
      };
      available_days?: string[];
    };
    financial?: {
      account_type?: string;
      mobile_money_provider?: string;
      bank_name?: string;
    };
    verification?: {
      verification_status?: string;
      id_type?: string;
    };
    onboarding_progress?: {
      basic?: boolean;
      pricing?: boolean;
      financial?: boolean;
      professional?: boolean;
      verification?: boolean;
    };
  };
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contact: true,
    about: true,
    services: true,
    professional: true,
    pricing: true,
    verification: true,
    financial: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MdBadge className="text-purple-500" />
          Profile Information
        </h2>
        <p className="text-gray-500 text-sm mb-6">Detailed overview of your profile and account information</p>
        
        {/* Contact Information */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
            onClick={() => toggleSection('contact')}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdEmail className="text-purple-500" />
              Contact Information
            </h3>
            <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.contact ? 'rotate-0' : '-rotate-90'}`} />
          </div>
          
          {expandedSections.contact && (
            <div className="mt-4 space-y-3 pl-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <MdEmail className="text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              
              {profile.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <MdPhone className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}
              
              {profile.profile?.address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <MdLocationOn className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{profile.profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* About Section */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
            onClick={() => toggleSection('about')}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdPerson className="text-purple-500" />
              About
            </h3>
            <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.about ? 'rotate-0' : '-rotate-90'}`} />
          </div>
          
          {expandedSections.about && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-700">
                {profile.bio || profile.professional?.description || "No information provided yet."}
              </p>
            </div>
          )}
        </div>
        
        {/* Additional sections for worker profile */}
        {profile.role === 'worker' && (
          <>
            {/* Services Section */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
                onClick={() => toggleSection('services')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MdWork className="text-purple-500" />
                  Services & Skills
                </h3>
                <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.services ? 'rotate-0' : '-rotate-90'}`} />
              </div>
              
              {expandedSections.services && (
                <div className="mt-4 space-y-4 pl-2">
                  {profile.professional?.services && profile.professional.services.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.professional.services.map((service: string, index: number) => (
                          <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.professional?.skills && profile.professional.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.professional.skills.map((skill: string, index: number) => (
                          <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.professional?.certifications && profile.professional.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.professional.certifications.map((cert: string, index: number) => (
                          <span key={index} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Professional Background */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
                onClick={() => toggleSection('professional')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MdSchool className="text-purple-500" />
                  Professional Background
                </h3>
                <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.professional ? 'rotate-0' : '-rotate-90'}`} />
              </div>
              
              {expandedSections.professional && (
                <div className="mt-4 space-y-4 pl-2">
                  {profile.professional?.experience && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Experience Level</h4>
                      <p className="text-gray-900">{profile.professional.experience}</p>
                    </div>
                  )}
                  
                  {profile.professional?.education && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <MdSchool className="text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="text-gray-900">{profile.professional.education}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pricing & Availability */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
                onClick={() => toggleSection('pricing')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MdPayment className="text-purple-500" />
                  Pricing & Availability
                </h3>
                <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.pricing ? 'rotate-0' : '-rotate-90'}`} />
              </div>
              
              {expandedSections.pricing && profile.pricing && (
                <div className="mt-4 space-y-4 pl-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.pricing.hourly_rate && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500">Hourly Rate</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <MdAttachMoney className="text-purple-500" />
                          <p className="text-lg font-semibold text-purple-600">${profile.pricing.hourly_rate}/hour</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.pricing.max_distance && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500">Service Radius</h4>
                        <p className="text-lg font-semibold text-gray-900">{profile.pricing.max_distance} km</p>
                      </div>
                    )}
                  </div>

                  {profile.pricing.service_area && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Service Area</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MdLocationOn className="text-gray-500" />
                        <p className="text-gray-900">{profile.pricing.service_area}</p>
                      </div>
                    </div>
                  )}

                  {profile.pricing.working_hours && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Working Hours</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MdAccessTime className="text-gray-500" />
                        <p className="text-gray-900">
                          {formatTime(profile.pricing.working_hours.start)} - {formatTime(profile.pricing.working_hours.end)}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.pricing.available_days && profile.pricing.available_days.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Available Days</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.pricing.available_days.map((day: string, index: number) => (
                          <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
                onClick={() => toggleSection('verification')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MdVerified className="text-purple-500" />
                  Verification Status
                </h3>
                <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.verification ? 'rotate-0' : '-rotate-90'}`} />
              </div>
              
              {expandedSections.verification && profile.verification && (
                <div className="mt-4 space-y-4 pl-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium mt-1 inline-block ${
                      profile.verification.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      profile.verification.verification_status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                      'bg-rose-100 text-rose-800 border-rose-200'
                    }`}>
                      {profile.verification.verification_status?.toUpperCase() || 'NOT VERIFIED'}
                    </span>
                  </div>
                  
                  {profile.verification.id_type && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">ID Document Type</h4>
                      <p className="text-gray-900 capitalize">{profile.verification.id_type}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-xl"
                onClick={() => toggleSection('financial')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MdAccountBalance className="text-purple-500" />
                  Payment Setup
                </h3>
                <MdExpandMore className={`transform transition-transform text-gray-500 ${expandedSections.financial ? 'rotate-0' : '-rotate-90'}`} />
              </div>
              
              {expandedSections.financial && profile.financial && (
                <div className="mt-4 space-y-4 pl-2">
                  {profile.financial.account_type && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200 uppercase mt-1 inline-block">
                        {profile.financial.account_type}
                      </span>
                    </div>
                  )}
                  
                  {profile.financial.mobile_money_provider && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Mobile Money Provider</h4>
                      <p className="text-gray-900 uppercase">{profile.financial.mobile_money_provider}</p>
                    </div>
                  )}

                  {profile.financial.bank_name && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500">Bank</h4>
                      <p className="text-gray-900">{profile.financial.bank_name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
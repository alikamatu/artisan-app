import { categoryIcons, regionNames, statusColors, urgencyColors, urgencyLabels, categoryLabels } from "@/constants/jobConstants";
import { GhanaRegion, Job, JobStatus } from "@/lib/types/jobs";
import { Bookmark, Calendar, CheckCircle, Clock, DollarSign, Eye, MapPin, Send, Users } from "lucide-react";
import { memo } from "react";

const FormatRegion = ({ region }: { region: GhanaRegion | undefined | null }) => (
  <span>
    {region ? (regionNames[region] || region.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')) : 'N/A'}
  </span>
);

// Helper function to parse location data
const parseLocation = (location: any) => {
  if (!location) return null;
  
  // If location is already an object, return it
  if (typeof location === 'object' && location.region && location.city) {
    return location;
  }
  
  // If location is a string (JSON), try to parse it
  if (typeof location === 'string') {
    try {
      return JSON.parse(location);
    } catch (error) {
      console.warn('Failed to parse location JSON:', location);
      return null;
    }
  }
  
  return null;
};

const GetProfilePhoto = ({ user }: { user: any }) => {
  const photo = user?.profile_photo || user?.metadata?.profile?.photo || user?.parsedMetadata?.profile?.photo;
  return photo ? <img src={photo} alt="Profile" width={40} height={40} className="rounded-full w-12 h-12 object-cover border-2 border-white shadow-sm" loading="lazy" /> : null;
};

const GetInitials = ({ user }: { user: any }) => {
  if (user?.first_name && user?.last_name) return <span>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()}</span>;
  if (user?.display_name) return <span>{user.display_name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2)}</span>;
  if (user?.name) return <span>{user.name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2)}</span>;
  return <span>U</span>;
};

const GetDisplayName = ({ user }: { user: any }) => (
  <span>{user?.display_name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || 'Unknown User')}</span>
);

const GetTimeAgo = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return <span>Just now</span>;
  if (diffInHours < 24) return <span>{diffInHours}h ago</span>;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return <span>{diffInDays}d ago</span>;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return <span>{diffInMonths}mo ago</span>;
};

const FormatBudget = ({ min, max }: { min: number; max: number }) => (
  <span>GHS {min.toLocaleString()} - {max.toLocaleString()}</span>
);

const JobCard = memo(({ 
  job, 
  showMyJobs, 
  savedJobs, 
  onJobClick, 
  onApply, 
  onSave 
}: {
  job: Job;
  showMyJobs: boolean;
  savedJobs: Set<string>;
  onJobClick: (id: string) => void;
  onApply: (e: React.MouseEvent, id: string) => void;
  onSave: (e: React.MouseEvent, id: string) => void;
}) => {
  // Parse the location data
  const parsedLocation = parseLocation(job.location);
  
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
      onClick={() => onJobClick(job.id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex-shrink-0 mt-0.5">
              {categoryIcons[job.category] || '🔌'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {parsedLocation?.city || 'N/A'}, <FormatRegion region={parsedLocation?.region} />
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <GetTimeAgo dateString={job.created_at} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button
            onClick={(e) => onSave(e, job.id)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors self-end"
            aria-label={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark 
              className={`h-5 w-5 transition-colors ${savedJobs.has(job.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
            />
          </button>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${urgencyColors[job.urgency]} whitespace-nowrap`}>
            {urgencyLabels[job.urgency]}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed text-balance">
        {job.description}
      </p>

      {/* Budget and Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2 font-bold text-emerald-600 text-base">
          <DollarSign className="h-4 w-4" />
          <FormatBudget min={job.budget_min} max={job.budget_max} />
        </div>
        {job.estimated_duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {job.estimated_duration}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {job.views_count.toLocaleString()} views
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {job.applications_count} applied
        </div>
      </div>

      {/* Skills */}
      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.required_skills.slice(0, 4).map((skill: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200 whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 4 && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{job.required_skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer: Client/Status Info and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          {showMyJobs ? (
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${statusColors[job.status]}`}>
                {job.status.replace('_', ' ').toUpperCase()}
              </div>
              {job.selected_worker && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="relative flex-shrink-0">
                    <GetProfilePhoto user={job.selected_worker} /> 
                    {job.selected_worker.verification_status === 'verified' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="truncate"><GetDisplayName user={job.selected_worker} /></span>
                </div>
              )}
            </div>
          ) : (
            job.client && (
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <GetProfilePhoto user={job.client} /> 
                  {job.client.verification_status === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    <GetDisplayName user={job.client} />
                  </p>
                </div>
              </div>
            )
          )}
        </div>
        {!showMyJobs && job.status === JobStatus.OPEN && (
          <button
            onClick={(e) => onApply(e, job.id)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Send className="h-4 w-4" />
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
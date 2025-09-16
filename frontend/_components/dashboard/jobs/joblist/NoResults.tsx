import { Search } from "lucide-react";

const NoResults = ({ showMyJobs, router }: { showMyJobs: boolean; router: any }) => (
  <div className="text-center py-16 bg-white/80 rounded-2xl shadow-sm border border-white/20">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
      <p className="text-gray-600 mb-8 leading-relaxed text-balance">
        {showMyJobs 
          ? "You haven't posted any jobs yet. Create your first job to get started."
          : "Try adjusting your search or filters to find jobs."
        }
      </p>
      {showMyJobs && (
        <button
          onClick={() => router.push('/dashboard/jobs/create-job')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Post Your First Job
        </button>
      )}
    </div>
  </div>
);

export default NoResults;
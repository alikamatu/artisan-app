import { JobFilters } from "@/lib/types/jobs";

const ResultsHeader = ({ isLoading, total, debouncedSearch, filters, page, totalPages }: { 
  isLoading: boolean; 
  total: number; 
  debouncedSearch: string; 
  filters: JobFilters; 
  page: number; 
  totalPages: number 
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/20">
    <div className="text-gray-700 mb-2 sm:mb-0">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Searching for jobs...
        </div>
      ) : (
        <span>
          About <strong className="text-gray-900 font-bold">{total.toLocaleString()}</strong> results 
          {debouncedSearch && (
            <>
              {' '}for <strong className="text-blue-600">"{debouncedSearch}"</strong>
            </>
          )}
          {Object.keys(filters).filter(k => k !== 'page' && k !== 'limit' && k !== 'sort_by' && k !== 'sort_order' && filters[k as keyof JobFilters]).length > 0 && (
            <span className="ml-2 text-sm">
              {' '}(filtered)
            </span>
          )}
        </span>
      )}
    </div>
    {!isLoading && totalPages > 0 && (
      <div className="text-sm text-gray-500 mt-2 sm:mt-0">
        Page {page} of {totalPages}
      </div>
    )}
  </div>
);

export default ResultsHeader;
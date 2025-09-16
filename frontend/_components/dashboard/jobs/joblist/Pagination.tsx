import { JobFilters } from "@/lib/types/jobs";

const Pagination = ({ page, totalPages, isLoading, handlePageChange, filters, total }: { 
  page: number; 
  totalPages: number; 
  isLoading: boolean; 
  handlePageChange: (newPage: number) => void; 
  filters: JobFilters; 
  total: number 
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 px-6 py-4 gap-4">
    <div className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
      Showing {((page - 1) * filters.limit!) + 1} to {Math.min(page * filters.limit!, total)} of {total.toLocaleString()} results
    </div>
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1 || isLoading}
        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium min-w-[80px]"
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages > 5 ? 5 : totalPages }, (_, i) => {
          let pageNum = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - (totalPages > 5 ? 4 : totalPages - 1) + i : page - 2 + i;
          if (totalPages > 5 && (i === 0 && page > 3 || i === 4 && page < totalPages - 2)) {
            pageNum = i < 2 ? i + 1 : i > 2 ? totalPages - (4 - i) : page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 font-medium min-w-[40px] ${
                page === pageNum ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {totalPages > 5 && (
          <>
            {page > 3 && page < totalPages - 2 && <span className="px-2 text-gray-400">…</span>}
            {page <= 3 && <span className="px-2 text-gray-400">…</span>}
            {page >= totalPages - 2 && <span className="px-2 text-gray-400">…</span>}
          </>
        )}
      </div>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages || isLoading}
        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium min-w-[80px]"
      >
        Next
      </button>
    </div>
  </div>
);

export default Pagination;
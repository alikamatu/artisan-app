import { JobFilters } from "@/lib/types/jobs";
import { SortAsc } from "lucide-react";

const SortDropdown = ({ filters, handleFilterChange }: { filters: JobFilters; handleFilterChange: (newFilters: Partial<JobFilters>) => void }) => (
  <div className="relative w-48">
    <select
      value={`${filters.sort_by}-${filters.sort_order}`}
      onChange={(e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        handleFilterChange({ sort_by: sortBy as any, sort_order: sortOrder as 'ASC' | 'DESC' });
      }}
      className="w-full pl-10 pr-8 py-4 border-0 bg-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none appearance-none shadow-inner text-gray-900"
      aria-label="Sort results"
    >
      <option value="created_at-DESC">Newest first</option>
      <option value="created_at-ASC">Oldest first</option>
      <option value="budget_max-DESC">Highest budget</option>
      <option value="budget_max-ASC">Lowest budget</option>
      <option value="views_count-DESC">Most viewed</option>
      <option value="applications_count-DESC">Most applied</option>
    </select>
    <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export default SortDropdown;
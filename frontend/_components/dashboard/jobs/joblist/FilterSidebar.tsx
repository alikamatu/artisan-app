import { GhanaRegion, JobCategory, JobFilters, JobStatus, JobUrgency } from "@/lib/types/jobs";
import { X } from "lucide-react";


const regionNames = {
  [GhanaRegion.GREATER_ACCRA]: 'Greater Accra',
  [GhanaRegion.ASHANTI]: 'Ashanti',
  [GhanaRegion.WESTERN]: 'Western',
  [GhanaRegion.CENTRAL]: 'Central',
  [GhanaRegion.VOLTA]: 'Volta',
  [GhanaRegion.EASTERN]: 'Eastern',
  [GhanaRegion.NORTHERN]: 'Northern',
  [GhanaRegion.UPPER_EAST]: 'Upper East',
  [GhanaRegion.UPPER_WEST]: 'Upper West',
  [GhanaRegion.BRONG_AHAFO]: 'Brong Ahafo',
  [GhanaRegion.WESTERN_NORTH]: 'Western North',
  [GhanaRegion.AHAFO]: 'Ahafo',
  [GhanaRegion.BONO]: 'Bono',
  [GhanaRegion.BONO_EAST]: 'Bono East',
  [GhanaRegion.OTI]: 'Oti',
  [GhanaRegion.SAVANNAH]: 'Savannah',
  [GhanaRegion.NORTH_EAST]: 'North East'
};

const urgencyLabels = {
  [JobUrgency.LOW]: 'Low',
  [JobUrgency.MEDIUM]: 'Medium',
  [JobUrgency.HIGH]: 'High',
  [JobUrgency.URGENT]: 'Urgent'
};

const filterOptions = [
  { key: 'category', type: 'select', label: 'Category', options: Object.values(JobCategory).map(cat => ({ value: cat, label: cat.replace('_', ' ').toUpperCase() })) },
  { key: 'urgency', type: 'select', label: 'Urgency', options: Object.values(JobUrgency).map(urg => ({ value: urg, label: urgencyLabels[urg as JobUrgency] })) },
  { key: 'status', type: 'select', label: 'Status', options: Object.values(JobStatus).map(stat => ({ value: stat, label: stat.replace('_', ' ').toUpperCase() })) },
  { key: 'region', type: 'select', label: 'Region', options: Object.entries(regionNames).map(([key, label]) => ({ value: key as GhanaRegion, label })) },
  { key: 'min_budget', type: 'range', label: 'Min Budget (GHS)', min: 0, max: 5000, step: 50 },
  { key: 'max_distance_km', type: 'range', label: 'Max Distance (km)', min: 0, max: 100, step: 5 },
  { key: 'min_rating', type: 'select', label: 'Min Rating', options: [{ value: 0, label: 'Any' }, { value: 3, label: '3+' }, { value: 4, label: '4+' }, { value: 5, label: '5' }] },
  { key: 'verified_clients_only', type: 'checkbox', label: 'Verified Clients Only' },
  { key: 'remote_ok', type: 'checkbox', label: 'Remote OK' }
];

const FilterSidebar = ({ showFilters, setShowFilters, filters, handleFilterChange, clearFilters }: { 
  showFilters: boolean; 
  setShowFilters: (value: boolean) => void; 
  filters: JobFilters; 
  handleFilterChange: (newFilters: Partial<JobFilters>) => void; 
  clearFilters: () => void 
}) => (
  <>
    {showFilters && (
      <>
        <aside
          id="filter-sidebar"
          className="fixed inset-y-0 right-0 z-50 w-full h-screen sm:w-80 bg-white shadow-2xl border-l border-gray-200"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {filterOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 block">{option.label}</label>
                {option.type === 'select' && (
                  <select
                    value={
                      typeof filters[option.key as keyof JobFilters] === 'boolean'
                        ? ''
                        : filters[option.key as keyof JobFilters] === false
                          ? ''
                          : filters[option.key as keyof JobFilters] !== undefined
                            ? filters[option.key as keyof JobFilters] as string | number
                            : ''
                    }
                    onChange={(e) => handleFilterChange({ [option.key]: e.target.value || undefined })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    {option.options && option.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {option.type === 'range' && (
                  <input
                    type="range"
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={
                      typeof filters[option.key as keyof JobFilters] === 'number'
                        ? (filters[option.key as keyof JobFilters] as number)
                        : option.min
                    }
                    onChange={(e) => handleFilterChange({ [option.key]: parseInt(e.target.value) })}
                    className="w-full"
                  />
                )}
                {option.type === 'checkbox' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!filters[option.key as keyof JobFilters]}
                      onChange={(e) => handleFilterChange({ [option.key]: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                )}
              </div>
            ))}
            <button
              onClick={clearFilters}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowFilters(false)}
        />
      </>
    )}
  </>
);

export default FilterSidebar;
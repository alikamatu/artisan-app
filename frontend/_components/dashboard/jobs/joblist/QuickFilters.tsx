import { JobFilters, JobUrgency } from "@/lib/types/jobs";
import { Clock, DollarSign, MapPin, Shield, Star, X } from "lucide-react";

const QuickFilters = ({ filters, handleFilterChange, clearFilters }: { filters: JobFilters; handleFilterChange: (newFilters: Partial<JobFilters>) => void; clearFilters: () => void }) => (
  <div className="flex flex-wrap gap-2 mt-6">
    {[
      { key: 'urgency', value: JobUrgency.URGENT, label: 'Urgent', icon: Clock, color: 'red' },
      { key: 'min_rating', value: 4, label: '4+ Stars', icon: Star, color: 'yellow' },
      { key: 'verified_clients_only', value: true, label: 'Verified', icon: Shield, color: 'green' },
      { key: 'max_distance_km', value: 10, label: 'Nearby', icon: MapPin, color: 'blue' },
      { key: 'min_budget', value: 100, label: 'GHS 100+', icon: DollarSign, color: 'emerald' }
    ].map((pill) => {
      const isActive = filters[pill.key as keyof JobFilters] === pill.value;
      const Icon = pill.icon;
      return (
        <button
          key={pill.key}
          onClick={() => handleFilterChange({ [pill.key]: isActive ? undefined : pill.value })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
            isActive ? `bg-${pill.color}-500 text-white shadow-${pill.color}-200/50` : `bg-gray-100 text-gray-700 hover:bg-gray-200`
          }`}
        >
          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
          {pill.label}
        </button>
      );
    })}
    <button
      onClick={clearFilters}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-all duration-200"
    >
      <X className="h-4 w-4" />
      Clear
    </button>
  </div>
);

export default QuickFilters;
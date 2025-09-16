import { Filter } from "lucide-react";

const FilterButton = ({ showFilters, setShowFilters }: { showFilters: boolean; setShowFilters: (value: boolean) => void }) => (
  <button
    onClick={() => setShowFilters(!showFilters)}
    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-medium transition-all duration-200 shadow-md ${
      showFilters ? 'bg-blue-500 text-white shadow-blue-200/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg'
    }`}
    aria-expanded={showFilters}
    aria-controls="filter-sidebar"
  >
    <Filter className="h-5 w-5" />
    <span className="hidden sm:inline">Filters</span>
  </button>
);

export default FilterButton;
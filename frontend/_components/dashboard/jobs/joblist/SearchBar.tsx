import { Search, X } from "lucide-react";

const SearchBar = ({ searchInput, setSearchInput }: { searchInput: string; setSearchInput: (value: string) => void }) => (
  <div className="flex-1 w-full relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="h-6 w-6 text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search jobs, skills, categories, or keywords... (min 2 chars)"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="w-full pl-12 pr-12 py-4 text-lg bg-white/50 border-0 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder-gray-500 text-gray-900 shadow-inner"
      aria-label="Search jobs"
    />
    {searchInput && (
      <button
        onClick={() => setSearchInput('')}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

export default SearchBar;
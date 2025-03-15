import React from 'react';
import { Input } from "@/components/ui/input";
import { MapPin, X, Search } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  onClear,
  isLoading,
  disabled = false
}) => {
  return (
    <div className="relative">
      <Input
        id="venue"
        placeholder="Search for a venue..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isLoading || disabled}
        className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-400 focus:ring-blue-300 transition-all duration-300 pr-10 pl-9"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClear();
          }
        }}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <MapPin className="h-4 w-4 text-gray-400" />
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
        {searchQuery && (
          <button 
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Clear search"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Search className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;

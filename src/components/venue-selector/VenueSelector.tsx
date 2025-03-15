import React, { useState, useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CricketGround } from '@/utils/supabaseClient';
import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useVenueAPI } from '@/utils/venueApi';
import { useQuery } from '@tanstack/react-query';
import { fetchCricketGrounds } from '@/utils/supabaseClient';
import SearchInput from './SearchInput';
import CountryFilter from './CountryFilter';
import VenueList from './VenueList';

interface VenueSelectorProps {
  venue: string;
  setVenue: (value: string) => void;
  venueList: CricketGround[];
  isLoading?: boolean;
  onRefresh?: () => void;
  disabled?: boolean;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({ 
  venue, 
  setVenue, 
  venueList,
  isLoading = false,
  onRefresh,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { refreshVenuesFromAPI } = useVenueAPI();

  // Get unique countries from venue list
  const countries = Array.from(new Set(venueList.map(v => v.country))).sort();
  
  // Fetch venues based on selected country
  const { data: filteredVenues = [], isLoading: isLoadingVenues, refetch } = useQuery({
    queryKey: ['cricket-grounds', selectedCountry],
    queryFn: () => fetchCricketGrounds(selectedCountry || undefined),
    enabled: showDropdown,
  });
  
  // Initialize searchQuery with venue value when component mounts
  useEffect(() => {
    if (venue) {
      setSearchQuery(venue);
    }
  }, [venue]);
  
  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter venues based on search query
  const searchFilteredVenues = filteredVenues.filter(v => 
    v.ground.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
    setVenue('');
    setShowDropdown(false);
  };

  // Filter by country
  const handleCountryFilter = (country: string) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
    }
  };

  // Get venue count by country
  const getVenueCountByCountry = (country: string) => {
    return venueList.filter(v => v.country === country).length;
  };

  // Handle venue selection
  const handleVenueSelect = (v: CricketGround) => {
    setVenue(v.ground);
    setSearchQuery(v.ground);
    setShowDropdown(false);
  };

  // Handle import venues from API
  const handleImportVenues = async () => {
    setIsImporting(true);
    try {
      if (await refreshVenuesFromAPI() && onRefresh) {
        onRefresh();
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <motion.div 
      className="space-y-2 relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex justify-between items-center">
        <Label htmlFor="venue" className="font-medium text-gray-700 dark:text-gray-300">Match Venue</Label>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={handleImportVenues}
            disabled={isImporting || isLoading || disabled}
          >
            <Download className={`h-3 w-3 mr-1 ${isImporting ? 'animate-pulse' : ''}`} />
            Import
          </Button>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={onRefresh}
              disabled={isLoading || disabled}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <SearchInput 
            searchQuery={searchQuery} 
            setSearchQuery={(value) => {
              setSearchQuery(value);
              setShowDropdown(true);
            }}
            onClear={handleClearSearch}
            isLoading={isLoadingVenues}
            disabled={disabled}
          />
        )}
        
        {showDropdown && !isLoading && (
          <div className="absolute z-[100] mt-1 w-full overflow-hidden rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {/* Country filters */}
            {searchQuery.length < 2 && (
              <CountryFilter 
                countries={countries}
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountryFilter}
                getVenueCountByCountry={getVenueCountByCountry}
              />
            )}
            
            {/* Venue list */}
            <VenueList 
              filteredVenues={searchFilteredVenues}
              searchQuery={searchQuery}
              onVenueSelect={handleVenueSelect}
            />
          </div>
        )}
      </div>
      
      {/* Hidden input to store the actual selected value */}
      <input type="hidden" value={venue} />
    </motion.div>
  );
};

export default VenueSelector;

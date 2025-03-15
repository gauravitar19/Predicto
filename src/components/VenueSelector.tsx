
import React, { useState, useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CricketGround } from '@/utils/supabaseClient';
import { motion } from 'framer-motion';
import { Search, X, MapPin, Globe, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface VenueSelectorProps {
  venue: string;
  setVenue: (value: string) => void;
  venueList: CricketGround[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({ 
  venue, 
  setVenue, 
  venueList,
  isLoading = false,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get unique countries from venue list
  const countries = Array.from(new Set(venueList.map(v => v.country))).sort();
  
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
  
  // Filter venues based on search query and selected country
  const filteredVenues = venueList.filter(v => {
    const matchesSearch = 
      v.ground.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = 
      !selectedCountry || 
      v.country === selectedCountry;
    
    return matchesSearch && matchesCountry;
  });

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

  return (
    <motion.div 
      className="space-y-2 relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex justify-between items-center">
        <Label htmlFor="venue" className="font-medium text-gray-700 dark:text-gray-300">Match Venue</Label>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
      
      <div className="relative" ref={dropdownRef}>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="relative">
            <Input
              id="venue"
              placeholder="Search for a venue..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-400 focus:ring-blue-300 transition-all duration-300 pr-10 pl-9"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {searchQuery && (
                <button 
                  type="button"
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
        
        {showDropdown && !isLoading && (
          <div 
            className="absolute z-[100] mt-1 w-full overflow-hidden rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
          >
            {/* Country filters */}
            {searchQuery.length < 2 && countries.length > 0 && (
              <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Filter by country:
                </p>
                <div className="flex flex-wrap gap-1">
                  {countries.map(country => (
                    <button
                      key={country}
                      onClick={() => handleCountryFilter(country)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedCountry === country 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {country} ({getVenueCountByCountry(country)})
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Venue list */}
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {searchQuery && filteredVenues.length > 0 && filteredVenues.map((v) => (
                <div
                  key={v.id}
                  className="relative cursor-pointer select-none py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => {
                    setVenue(v.ground);
                    setSearchQuery(v.ground);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex-1">
                    <p className="font-medium">{v.ground}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" /> 
                      {v.country}
                      {v.odi_only && (
                        <span className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded-full text-[10px]">
                          ODI Only
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {v.width}m × {v.height}m
                  </div>
                </div>
              ))}
              
              {searchQuery && filteredVenues.length === 0 && (
                <div className="py-2 px-3 text-gray-500 dark:text-gray-400">
                  No venues found
                </div>
              )}
              
              {!searchQuery && (
                <div className="py-2 px-3 text-gray-500 dark:text-gray-400 text-center">
                  Type to search for venues or select a country
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden input to store the actual selected value */}
      <input type="hidden" value={venue} />
    </motion.div>
  );
};

export default VenueSelector;

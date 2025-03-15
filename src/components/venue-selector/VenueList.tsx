
import React from 'react';
import { MapPin } from 'lucide-react';
import { CricketGround } from '@/utils/supabaseClient';

interface VenueListProps {
  filteredVenues: CricketGround[];
  searchQuery: string;
  onVenueSelect: (venue: CricketGround) => void;
}

const VenueList: React.FC<VenueListProps> = ({ 
  filteredVenues, 
  searchQuery, 
  onVenueSelect 
}) => {
  if (!searchQuery) {
    return (
      <div className="py-2 px-3 text-gray-500 dark:text-gray-400 text-center">
        Type to search for venues or select a country
      </div>
    );
  }

  if (filteredVenues.length === 0) {
    return (
      <div className="py-2 px-3 text-gray-500 dark:text-gray-400">
        No venues found
      </div>
    );
  }

  return (
    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
      {filteredVenues.map((venue) => (
        <div
          key={venue.id}
          className="relative cursor-pointer select-none py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          onClick={() => onVenueSelect(venue)}
        >
          <div className="flex-1">
            <p className="font-medium">{venue.ground}</p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1" /> 
              {venue.country}
              {venue.odi_only && (
                <span className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded-full text-[10px]">
                  ODI Only
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {venue.width}m × {venue.height}m
          </div>
        </div>
      ))}
    </div>
  );
};

export default VenueList;

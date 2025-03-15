import React, { useEffect } from 'react';
import VenueSelector from '../venue-selector/VenueSelector';
import MatchFormatSelector from '../MatchFormatSelector';
import { useQuery } from '@tanstack/react-query';
import { fetchCricketGrounds, CricketGround } from '@/utils/supabaseClient';
import { Badge } from "@/components/ui/badge";
import { Info } from 'lucide-react';

interface VenueFormatSectionProps {
  venue: string;
  setVenue: (value: string) => void;
  matchFormat: string;
  setMatchFormat: (format: string) => void;
  onVenueSelect?: (venue: string, country: string) => void;
  isDisabled?: boolean;
}

const VenueFormatSection: React.FC<VenueFormatSectionProps> = ({
  venue, setVenue, matchFormat, setMatchFormat, onVenueSelect, isDisabled = false
}) => {
  const { data: venueList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cricket-grounds'],
    queryFn: fetchCricketGrounds,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  // When venue changes, find its country and trigger the onVenueSelect callback
  useEffect(() => {
    if (venue && onVenueSelect && venueList.length > 0) {
      const selectedVenue = venueList.find((v: CricketGround) => v.ground === venue);
      if (selectedVenue) {
        onVenueSelect(venue, selectedVenue.country);
      }
    }
  }, [venue, venueList, onVenueSelect]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <VenueSelector 
            venue={venue} 
            setVenue={setVenue} 
            venueList={venueList}
            isLoading={isLoading}
            onRefresh={() => refetch()}
            disabled={isDisabled}
          />
          {isError && (
            <p className="text-xs text-red-500 flex items-center">
              <Info className="h-3 w-3 mr-1" /> 
              Error loading venues. Please try again.
            </p>
          )}
          {isLoading && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Loading venues...
            </Badge>
          )}
        </div>
        
        <MatchFormatSelector 
          matchFormat={matchFormat} 
          setMatchFormat={setMatchFormat}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default VenueFormatSection;

import React, { useEffect, useState } from 'react';
import VenueSelector from '../venue-selector/VenueSelector';
import MatchFormatSelector from '../MatchFormatSelector';
import { useQuery } from '@tanstack/react-query';
import { fetchCricketGrounds, CricketGround } from '@/utils/supabaseClient';
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const { data: venueList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cricket-grounds'],
    queryFn: fetchCricketGrounds,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    onError: (error: any) => {
      console.error('Error fetching venues:', error);
      setApiErrors('Failed to load venues from database. Please check your connection.');
      toast({
        title: 'Venue Data Error',
        description: 'Could not load cricket grounds. Check your API key and connection.',
        variant: 'destructive'
      });
    },
    onSuccess: (data) => {
      if (data.length === 0) {
        setApiErrors('No venues found in database. Try importing venues or check your API key.');
      } else {
        setApiErrors(null);
      }
    }
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

  const handleRefreshVenues = () => {
    refetch();
    setApiErrors(null);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <VenueSelector 
            venue={venue} 
            setVenue={setVenue} 
            venueList={venueList}
            isLoading={isLoading}
            onRefresh={handleRefreshVenues}
            disabled={isDisabled}
          />
          {(isError || apiErrors) && (
            <div className="text-xs text-red-500 flex items-center mt-1 p-2 bg-red-50 rounded-md">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" /> 
              <span>{apiErrors || 'Error loading venues. Check your API key and try again.'}</span>
            </div>
          )}
          {isLoading && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Loading venues...
            </Badge>
          )}
          {!isLoading && venueList.length === 0 && !apiErrors && (
            <div className="text-xs text-amber-500 flex items-center mt-1 p-2 bg-amber-50 rounded-md">
              <Info className="h-3 w-3 mr-1 flex-shrink-0" /> 
              <span>No venues found. Try clicking the "Import" button to fetch venues from the API.</span>
            </div>
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

import { supabase } from "@/integrations/supabase/client";
import { CricketGround } from "./supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Cricket venues API endpoint
const CRICKET_API_BASE_URL = "https://cricket-live-data.p.rapidapi.com/venues";
const CRICKET_API_HEADERS = {
  "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Note: This is a public API key placeholder
  "X-RapidAPI-Host": "cricket-live-data.p.rapidapi.com"
};

export interface APIVenue {
  venue: string;
  location: string;
  country: string;
  capacity?: number;
}

/**
 * Fetch cricket venues from external API
 */
export const fetchVenuesFromAPI = async (): Promise<APIVenue[]> => {
  try {
    const response = await fetch(CRICKET_API_BASE_URL, {
      method: "GET",
      headers: CRICKET_API_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.venues || [];
  } catch (error) {
    console.error("Error fetching venues from API:", error);
    return [];
  }
};

/**
 * Convert API venue to CricketGround format
 */
const mapAPIVenueToCricketGround = (apiVenue: APIVenue): Required<Pick<CricketGround, 'ground' | 'ground_long' | 'country' | 'height' | 'width'>> & Partial<CricketGround> => {
  return {
    ground: apiVenue.venue,
    ground_long: apiVenue.venue,
    country: apiVenue.country,
    height: 70, // Default values
    width: 70,
    rounded_rect: false,
    odi_only: false
  };
};

/**
 * Import new venues from API into Supabase
 */
export const importVenuesFromAPI = async (): Promise<number> => {
  try {
    // Fetch venues from API
    const apiVenues = await fetchVenuesFromAPI();
    if (!apiVenues.length) return 0;
    
    // Get existing venues to avoid duplicates
    const { data: existingVenues } = await supabase
      .from('cricket_grounds')
      .select('ground');
    
    const existingVenueNames = existingVenues?.map(v => v.ground.toLowerCase()) || [];
    
    // Filter out venues that already exist
    const newVenues = apiVenues.filter(
      venue => !existingVenueNames.includes(venue.venue.toLowerCase())
    );
    
    if (!newVenues.length) return 0;
    
    // Map API venues to our database format with required fields
    const venuesToInsert = newVenues.map(mapAPIVenueToCricketGround);
    
    // Insert new venues
    const { error } = await supabase
      .from('cricket_grounds')
      .insert(venuesToInsert);
    
    if (error) {
      console.error("Error importing venues to Supabase:", error);
      return 0;
    }
    
    return venuesToInsert.length;
  } catch (error) {
    console.error("Error in venue import process:", error);
    return 0;
  }
};

// React hook for venue API operations
export const useVenueAPI = () => {
  const { toast } = useToast();
  
  const refreshVenuesFromAPI = async () => {
    try {
      const importedCount = await importVenuesFromAPI();
      
      if (importedCount > 0) {
        toast({
          title: "Venues Updated",
          description: `Imported ${importedCount} new venues from API`,
        });
        return true;
      } else {
        toast({
          title: "Venues Up to Date",
          description: "No new venues found to import",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import venues from API",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return { refreshVenuesFromAPI };
};

import { supabase } from "@/integrations/supabase/client";
import { CricketGround } from "./supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Cricket venues API endpoint
const CRICKET_API_BASE_URL = "https://cricket-live-data.p.rapidapi.com/venues";
const CRICKET_API_HEADERS = {
  "X-RapidAPI-Key": import.meta.env.VITE_CRICKET_API_KEY || "",
  "X-RapidAPI-Host": "cricket-live-data.p.rapidapi.com"
};

// Open source cricket API for venues
const OPEN_SOURCE_VENUES_URL = "https://cricket-api.vercel.app/api/grounds";

// Check if API key is available
const hasApiKey = !!import.meta.env.VITE_CRICKET_API_KEY;

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
    // Try open source API first if no API key
    if (!hasApiKey) {
      return await fetchVenuesFromOpenSource();
    }
    
    // Use the primary API if key is available
    const response = await fetch(CRICKET_API_BASE_URL, {
      method: "GET",
      headers: CRICKET_API_HEADERS
    });
    
    if (!response.ok) {
      console.warn(`API responded with status: ${response.status}, trying open source API`);
      return await fetchVenuesFromOpenSource();
    }
    
    const data = await response.json();
    return data.venues || [];
  } catch (error) {
    console.error("Error fetching venues from API:", error);
    // Try open source as fallback
    return await fetchVenuesFromOpenSource();
  }
};

/**
 * Fetch venues from open source API
 */
export const fetchVenuesFromOpenSource = async (): Promise<APIVenue[]> => {
  try {
    const response = await fetch(OPEN_SOURCE_VENUES_URL);
    
    if (!response.ok) {
      throw new Error(`Open source API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the open source data to our expected format
    return data.map((venue: any) => ({
      venue: venue.name || venue.ground || "Unknown Ground",
      location: venue.city || venue.location || "Unknown Location",
      country: venue.country || "Unknown Country",
      capacity: venue.capacity || 0
    }));
  } catch (error) {
    console.error("Error fetching venues from open source API:", error);
    return getDefaultVenues();
  }
};

/**
 * Default venues as a fallback when APIs fail
 */
export const getDefaultVenues = (): APIVenue[] => {
  return [
    { venue: "Melbourne Cricket Ground", location: "Melbourne", country: "Australia", capacity: 100000 },
    { venue: "Eden Gardens", location: "Kolkata", country: "India", capacity: 66000 },
    { venue: "Lord's Cricket Ground", location: "London", country: "England", capacity: 30000 },
    { venue: "Sydney Cricket Ground", location: "Sydney", country: "Australia", capacity: 48000 },
    { venue: "Wankhede Stadium", location: "Mumbai", country: "India", capacity: 33000 },
    { venue: "Wanderers Stadium", location: "Johannesburg", country: "South Africa", capacity: 34000 },
    { venue: "M.Chinnaswamy Stadium", location: "Bangalore", country: "India", capacity: 40000 },
    { venue: "Adelaide Oval", location: "Adelaide", country: "Australia", capacity: 53000 },
    { venue: "Gaddafi Stadium", location: "Lahore", country: "Pakistan", capacity: 27000 },
    { venue: "Kensington Oval", location: "Bridgetown", country: "West Indies", capacity: 28000 }
  ];
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

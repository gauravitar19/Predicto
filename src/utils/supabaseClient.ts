import { supabase } from "@/integrations/supabase/client";

export interface CricketGround {
  id: string;
  ground: string;
  ground_long: string;
  country: string;
  height: number;
  width: number;
  rounded_rect: boolean;
  batting_record_name: string | null;
  batting_record_country: string | null;
  batting_record_against: string | null;
  batting_record_score: string | null;
  batting_record_date: string | null;
  bowling_record_name: string | null;
  bowling_record_country: string | null;
  bowling_record_against: string | null;
  bowling_record_figures: string | null;
  bowling_record_date: string | null;
  odi_only: boolean;
  measurement_url: string | null;
  notes: string | null;
}

export const fetchCricketGrounds = async (country?: string): Promise<CricketGround[]> => {
  console.log(`Fetching cricket grounds${country ? ` for ${country}` : ''} from Supabase...`);
  
  try {
    let query = supabase
      .from('cricket_grounds')
      .select('*')
      .order('ground', { ascending: true });
      
    if (country) {
      query = query.eq('country', country);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching cricket grounds:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No cricket grounds found in the database');
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} cricket grounds`);
    return data;
  } catch (error) {
    console.error('Error in fetchCricketGrounds:', error);
    // Return empty array instead of throwing error to prevent UI from breaking
    return [];
  }
};

export const fetchCricketGroundByName = async (groundName: string): Promise<CricketGround | null> => {
  if (!groundName) return null;
  
  console.log(`Fetching cricket ground details for: ${groundName}`);
  
  const { data, error } = await supabase
    .from('cricket_grounds')
    .select('*')
    .ilike('ground', `%${groundName}%`)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching cricket ground:', error);
    throw error;
  }
  
  console.log('Ground details retrieved:', data ? 'success' : 'not found');
  return data;
};

export const fetchGroundImages = async (groundId: string): Promise<any[]> => {
  if (!groundId) return [];
  
  const { data, error } = await supabase
    .from('ground_images')
    .select('*')
    .eq('ground_id', groundId);
  
  if (error) {
    console.error('Error fetching ground images:', error);
    return [];
  }
  
  return data || [];
};

export const subscribeToGroundUpdates = (callback: (ground: CricketGround) => void) => {
  const channel = supabase
    .channel('public:cricket_grounds')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'cricket_grounds' 
      }, 
      (payload) => {
        console.log('Ground update received:', payload);
        if (payload.new) {
          callback(payload.new as CricketGround);
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};

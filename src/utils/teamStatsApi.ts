
import { supabase } from "@/integrations/supabase/client";

export interface TeamStats {
  recentWins: number;
  battingAvg: number;
  bowlingAvg: number;
  lastUpdated: string;
}

export interface TeamStatsResponse {
  team: string;
  stats: TeamStats;
  dataSource: string;
}

// Fetch team stats from our edge function
export const fetchTeamStats = async (teamName: string): Promise<TeamStats> => {
  try {
    console.log(`Fetching real-time stats for team: ${teamName}`);
    
    const { data, error } = await supabase.functions.invoke('cricket-stats', {
      body: { team: teamName },
      method: 'POST',
    });
    
    if (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
    
    const response = data as TeamStatsResponse;
    console.log('Received team stats:', response);
    
    return response.stats;
  } catch (error) {
    console.error(`Failed to fetch stats for ${teamName}:`, error);
    // Return default stats if API call fails
    return {
      recentWins: 2,
      battingAvg: 28.5,
      bowlingAvg: 30.2,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Fetch available teams list
export const fetchTeamsList = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('cricket-stats', {
      method: 'GET',
    });
    
    if (error) {
      console.error('Error fetching teams list:', error);
      throw error;
    }
    
    return data.teams as string[];
  } catch (error) {
    console.error('Failed to fetch teams list:', error);
    // Return default list if API call fails
    return [
      "India", "Australia", "England", "South Africa", 
      "New Zealand", "Pakistan", "West Indies", "Sri Lanka", 
      "Bangladesh", "Afghanistan"
    ];
  }
};

import { toast } from "@/components/ui/use-toast";

// Register for an API key at https://cricketdata.org/
// Store your API key in .env file or use environment variables
const API_KEY = import.meta.env.VITE_CRICKET_API_KEY || "YOUR_API_KEY"; // Use environment variable
const BASE_URL = "https://api.cricapi.com/v1";

export interface LiveMatch {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: {
    name: string;
    shortname: string;
    img: string;
  }[];
  score: {
    r: number;
    w: number;
    o: number;
    inning: string;
  }[];
  seriesId: string;
  matchType: string;
  matchStarted: boolean;
  matchEnded: boolean;
}

export interface MatchStats {
  matchId: string;
  teamHomeName: string;
  teamAwayName: string;
  recentForm: {
    [teamName: string]: {
      matchesWon: number;
      totalMatches: number;
    };
  };
  h2h: {
    teamHomeWins: number;
    teamAwayWins: number;
    noResult: number;
    total: number;
  };
  venue: {
    name: string;
    location: string;
    homeTeamAdvantage: number; // 0-10 rating
  };
  keyPlayers: {
    [teamName: string]: {
      name: string;
      role: string;
      battingAvg?: number;
      bowlingAvg?: number;
      recentForm: number; // 0-10 rating
    }[];
  };
}

export interface CurrentSeries {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  matches: number;
  matchType: string;
}

// Get current matches
export const getCurrentMatches = async (): Promise<LiveMatch[]> => {
  try {
    const response = await fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`);
    const data = await response.json();
    
    if (!data.data) {
      throw new Error(data.status || "Failed to fetch current matches");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching current matches:", error);
    toast({
      title: "Error",
      description: "Failed to fetch current matches. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Get match details by ID
export const getMatchDetails = async (matchId: string): Promise<LiveMatch | null> => {
  try {
    const response = await fetch(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`);
    const data = await response.json();
    
    if (!data.data) {
      throw new Error(data.status || "Failed to fetch match details");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching match details:", error);
    toast({
      title: "Error",
      description: "Failed to fetch match details. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

// Get current series
export const getCurrentSeries = async (): Promise<CurrentSeries[]> => {
  try {
    const response = await fetch(`${BASE_URL}/series?apikey=${API_KEY}&offset=0`);
    const data = await response.json();
    
    if (!data.data) {
      throw new Error(data.status || "Failed to fetch current series");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching current series:", error);
    toast({
      title: "Error",
      description: "Failed to fetch current series. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Get match stats for prediction enhancement
export const getMatchStats = async (matchId: string): Promise<MatchStats | null> => {
  try {
    // This would be a real API call, but for now we'll simulate it
    // as the actual endpoint might differ depending on the API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // Simulated data
    return {
      matchId,
      teamHomeName: "Team A",
      teamAwayName: "Team B",
      recentForm: {
        "Team A": {
          matchesWon: 7,
          totalMatches: 10
        },
        "Team B": {
          matchesWon: 6,
          totalMatches: 10
        }
      },
      h2h: {
        teamHomeWins: 5,
        teamAwayWins: 3,
        noResult: 1,
        total: 9
      },
      venue: {
        name: "Stadium X",
        location: "City Y",
        homeTeamAdvantage: 7
      },
      keyPlayers: {
        "Team A": [
          {
            name: "Player 1",
            role: "Batsman",
            battingAvg: 48.5,
            recentForm: 8
          },
          {
            name: "Player 2",
            role: "Bowler",
            bowlingAvg: 22.3,
            recentForm: 7
          }
        ],
        "Team B": [
          {
            name: "Player 3",
            role: "All-rounder",
            battingAvg: 38.2,
            bowlingAvg: 28.4,
            recentForm: 9
          }
        ]
      }
    };
  } catch (error) {
    console.error("Error fetching match stats:", error);
    toast({
      title: "Error",
      description: "Failed to fetch match statistics. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

// Get player stats
export const getPlayerStats = async (playerId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/players_info?apikey=${API_KEY}&id=${playerId}`);
    const data = await response.json();
    
    if (!data.data) {
      throw new Error(data.status || "Failed to fetch player stats");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching player stats:", error);
    toast({
      title: "Error",
      description: "Failed to fetch player statistics. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
}; 
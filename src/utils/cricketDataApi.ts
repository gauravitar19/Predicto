import { toast } from "@/components/ui/use-toast";

// Register for an API key at https://cricketdata.org/
// Store your API key in .env file or use environment variables
const API_KEY = import.meta.env.VITE_CRICKET_API_KEY || ""; // Use environment variable
const BASE_URL = "https://api.cricapi.com/v1";

// Open source cricket API (no key required)
const OPEN_SOURCE_API_URL = "https://api.cricscore.com/api/v1";

// Determine whether to use the open source API based on API key
const useOpenSourceAPI = !API_KEY;

// Switch API endpoint based on availability of API key
const getApiEndpoint = (endpoint: string) => {
  if (useOpenSourceAPI) {
    return `${OPEN_SOURCE_API_URL}/${endpoint}`;
  }
  return `${BASE_URL}/${endpoint}?apikey=${API_KEY}`;
};

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
    // Use different implementation based on API availability
    if (useOpenSourceAPI) {
      return await getOpenSourceCurrentMatches();
    }
    
    // Original implementation with API key
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

// Open source API implementation for current matches
const getOpenSourceCurrentMatches = async (): Promise<LiveMatch[]> => {
  try {
    const response = await fetch(`${OPEN_SOURCE_API_URL}/matches`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our LiveMatch interface
    return data.map((match: any) => ({
      id: match.id.toString(),
      name: match.name || `${match.teams[0]} vs ${match.teams[1]}`,
      status: match.status || "In Progress",
      venue: match.venue || "Unknown Venue",
      date: match.date || new Date().toISOString().split('T')[0],
      dateTimeGMT: match.dateTimeGMT || new Date().toISOString(),
      teams: match.teams || [],
      teamInfo: (match.teams || []).map((team: string) => ({
        name: team,
        shortname: team.split(' ')[0],
        img: ""  // No images available in open source API
      })),
      score: match.score || [],
      seriesId: match.seriesId || "unknown",
      matchType: match.matchType || "T20",
      matchStarted: match.matchStarted !== false,
      matchEnded: match.matchEnded || false
    }));
  } catch (error) {
    console.error("Error fetching matches from open source API:", error);
    // Fall back to mock data if open source API fails
    return getMockMatches();
  }
};

// Mock data for when both APIs fail or no API key is provided
const getMockMatches = (): LiveMatch[] => {
  return [
    {
      id: "mock1",
      name: "India vs Australia",
      status: "India won by 5 wickets",
      venue: "Sydney Cricket Ground",
      date: new Date().toISOString().split('T')[0],
      dateTimeGMT: new Date().toISOString(),
      teams: ["India", "Australia"],
      teamInfo: [
        { name: "India", shortname: "IND", img: "" },
        { name: "Australia", shortname: "AUS", img: "" }
      ],
      score: [
        { r: 289, w: 10, o: 50, inning: "Australia Innings" },
        { r: 291, w: 5, o: 47.5, inning: "India Innings" }
      ],
      seriesId: "mock_series_1",
      matchType: "ODI",
      matchStarted: true,
      matchEnded: true
    },
    {
      id: "mock2",
      name: "England vs New Zealand",
      status: "In Progress",
      venue: "Lord's Cricket Ground",
      date: new Date().toISOString().split('T')[0],
      dateTimeGMT: new Date().toISOString(),
      teams: ["England", "New Zealand"],
      teamInfo: [
        { name: "England", shortname: "ENG", img: "" },
        { name: "New Zealand", shortname: "NZ", img: "" }
      ],
      score: [
        { r: 245, w: 8, o: 50, inning: "England Innings" },
        { r: 187, w: 5, o: 36.2, inning: "New Zealand Innings" }
      ],
      seriesId: "mock_series_2",
      matchType: "ODI",
      matchStarted: true,
      matchEnded: false
    },
    {
      id: "mock3",
      name: "South Africa vs Pakistan",
      status: "Starting Soon",
      venue: "Wanderers Stadium",
      date: new Date().toISOString().split('T')[0],
      dateTimeGMT: new Date(Date.now() + 3600000).toISOString(),
      teams: ["South Africa", "Pakistan"],
      teamInfo: [
        { name: "South Africa", shortname: "SA", img: "" },
        { name: "Pakistan", shortname: "PAK", img: "" }
      ],
      score: [],
      seriesId: "mock_series_3",
      matchType: "T20",
      matchStarted: false,
      matchEnded: false
    }
  ];
};

// Get match details by ID - add open source API support
export const getMatchDetails = async (matchId: string): Promise<LiveMatch | null> => {
  try {
    if (useOpenSourceAPI) {
      return await getOpenSourceMatchDetails(matchId);
    }
    
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

// Open source API implementation for match details
const getOpenSourceMatchDetails = async (matchId: string): Promise<LiveMatch | null> => {
  try {
    const response = await fetch(`${OPEN_SOURCE_API_URL}/match/${matchId}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const match = await response.json();
    
    return {
      id: match.id.toString(),
      name: match.name || `${match.teams[0]} vs ${match.teams[1]}`,
      status: match.status || "In Progress",
      venue: match.venue || "Unknown Venue",
      date: match.date || new Date().toISOString().split('T')[0],
      dateTimeGMT: match.dateTimeGMT || new Date().toISOString(),
      teams: match.teams || [],
      teamInfo: (match.teams || []).map((team: string) => ({
        name: team,
        shortname: team.split(' ')[0],
        img: ""
      })),
      score: match.score || [],
      seriesId: match.seriesId || "unknown",
      matchType: match.matchType || "T20",
      matchStarted: match.matchStarted !== false,
      matchEnded: match.matchEnded || false
    };
  } catch (error) {
    console.error("Error fetching match details from open source API:", error);
    // Return mock data for the requested match ID
    return getMockMatches().find(m => m.id === matchId) || null;
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
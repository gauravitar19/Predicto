import { CricketGround } from '../supabaseClient';
import { MatchStats } from '../cricketDataApi';

export interface PredictionInput {
  team1: string;
  team2: string;
  venue: string;
  matchFormat: string;
  weather: Weather;
  team1Stats: TeamStats;
  team2Stats: TeamStats;
  venueDetails: CricketGround | null;
  useAI?: boolean;
  matchId?: string;
}

export interface TeamStats {
  recentWins: number;
  battingAvg: number;
  bowlingAvg: number;
}

export interface Weather {
  temperature: number;
  humidity: number;
  condition: string;
}

export interface PredictionFactor {
  factor: string;
  weight: number;
  description?: string;
  impact?: number;
}

export interface PredictionResult {
  winner: string;
  probability: number;
  team1: string;
  team2: string;
  venue: string;
  matchFormat: string;
  factors: PredictionFactor[];
  venueDetails: CricketGround | null;
  weather: Weather;
  team1Stats: TeamStats;
  team2Stats: TeamStats;
  aiAnalysisUsed?: boolean;
  realTimeStatsUsed?: boolean;
  realTimeData?: MatchStats | null;
}

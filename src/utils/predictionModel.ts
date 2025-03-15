import { CricketGround } from './supabaseClient';
import { PredictionInput, PredictionResult } from './types/predictionTypes';
import { calculateTeamStrength } from './prediction/teamUtils';
import { calculateVenueAdvantage, calculateVenueFactors } from './prediction/venueUtils';
import { generateFactors } from './prediction/factorsGenerator';
import { analyzeTeamSentiment, getModelStatus } from './aiAnalysis';
import { getMatchStats, MatchStats } from './cricketDataApi';

// Main prediction function
export const predictMatchOutcome = async (input: PredictionInput): Promise<PredictionResult> => {
  // Extract values from input
  const { team1, team2, venue, matchFormat, weather, team1Stats, team2Stats, venueDetails, useAI, matchId } = input;
  
  // Calculate team strengths based on provided stats
  const team1Strength = calculateTeamStrength(team1Stats, weather);
  const team2Strength = calculateTeamStrength(team2Stats, weather);
  
  // Add venue advantage (10% boost for certain venues that might favor certain teams)
  const venueAdvantage = calculateVenueAdvantage(team1, team2, venue);
  
  // Calculate final team scores
  let team1Score = team1Strength + (venueAdvantage === team1 ? 10 : 0);
  let team2Score = team2Strength + (venueAdvantage === team2 ? 10 : 0);
  
  // Apply venue-specific scoring advantages based on real ground data
  if (venueDetails) {
    const venueFactors = calculateVenueFactors(venueDetails, team1, team2, matchFormat);
    team1Score += venueFactors.team1Bonus;
    team2Score += venueFactors.team2Bonus;
  }
  
  // Adjust for match format
  if (matchFormat === 'test' && team1Stats.bowlingAvg < team2Stats.bowlingAvg) {
    team1Score += 5; // Better bowling teams have advantage in test matches
  } else if (matchFormat === 't20' && team1Stats.battingAvg > 35) {
    team1Score += 5; // High batting average teams do better in T20
  }
  
  if (matchFormat === 'test' && team2Stats.bowlingAvg < team1Stats.bowlingAvg) {
    team2Score += 5;
  } else if (matchFormat === 't20' && team2Stats.battingAvg > 35) {
    team2Score += 5;
  }
  
  // NEW: Fetch and apply real-time match statistics if matchId is provided
  let realTimeStats: MatchStats | null = null;
  let realTimeFactors = [];
  
  if (matchId) {
    try {
      realTimeStats = await getMatchStats(matchId);
      
      if (realTimeStats) {
        // Apply head-to-head advantage
        const h2hAdvantage = calculateH2HAdvantage(realTimeStats, team1, team2);
        team1Score += h2hAdvantage.team1Bonus;
        team2Score += h2hAdvantage.team2Bonus;
        
        // Apply recent form advantage
        const formAdvantage = calculateRecentFormAdvantage(realTimeStats, team1, team2);
        team1Score += formAdvantage.team1Bonus;
        team2Score += formAdvantage.team2Bonus;
        
        // Apply key player influence
        const playerInfluence = calculateKeyPlayerInfluence(realTimeStats, team1, team2);
        team1Score += playerInfluence.team1Bonus;
        team2Score += playerInfluence.team2Bonus;
        
        realTimeFactors = generateRealTimeFactors(realTimeStats, team1, team2);
      }
    } catch (error) {
      console.error("Error applying real-time stats:", error);
      // Continue with prediction even if real-time stats fail
    }
  }
  
  // Use AI sentiment analysis if enabled
  if (useAI && getModelStatus().loaded) {
    try {
      const team1Sentiment = await analyzeTeamSentiment(
        team1,
        team1Stats.recentWins,
        10, // assuming out of last 10 matches
        team1Stats.battingAvg,
        team1Stats.bowlingAvg
      );
      
      const team2Sentiment = await analyzeTeamSentiment(
        team2,
        team2Stats.recentWins,
        10,
        team2Stats.battingAvg,
        team2Stats.bowlingAvg
      );
      
      // Apply AI confidence scores to the prediction (scale of 0-20 points)
      team1Score += team1Sentiment.confidence * 20;
      team2Score += team2Sentiment.confidence * 20;
      
      console.log("AI sentiment analysis:", {
        team1: team1Sentiment,
        team2: team2Sentiment
      });
    } catch (error) {
      console.error("Error in AI analysis:", error);
      // Continue with prediction even if AI fails
    }
  }
  
  // Determine winner and calculate probability
  const totalScore = team1Score + team2Score;
  const team1Probability = Math.round((team1Score / totalScore) * 100);
  const winner = team1Probability > 50 ? team1 : team2;
  const probability = team1Probability > 50 ? team1Probability : 100 - team1Probability;
  
  // Generate key factors that influenced the prediction
  let factors = generateFactors(team1, team2, input, winner);
  
  // Add real-time factors if available
  if (realTimeFactors.length > 0) {
    factors = [...factors, ...realTimeFactors];
  }
  
  // Include real-time stats in result if available
  return {
    winner,
    probability,
    team1,
    team2,
    venue,
    matchFormat,
    factors,
    venueDetails,
    weather,
    team1Stats,
    team2Stats,
    aiAnalysisUsed: useAI && getModelStatus().loaded,
    realTimeStatsUsed: !!realTimeStats,
    realTimeData: realTimeStats
  };
};

// Calculate advantage based on head-to-head record
const calculateH2HAdvantage = (stats: MatchStats, team1: string, team2: string) => {
  const h2h = stats.h2h;
  const totalMatches = h2h.total;
  
  if (totalMatches === 0) {
    return { team1Bonus: 0, team2Bonus: 0 };
  }
  
  const team1WinRate = stats.teamHomeName === team1 ? 
    h2h.teamHomeWins / totalMatches : 
    h2h.teamAwayWins / totalMatches;
  
  const team2WinRate = stats.teamHomeName === team2 ? 
    h2h.teamHomeWins / totalMatches : 
    h2h.teamAwayWins / totalMatches;
  
  // Scale: up to 10 points advantage for dominant h2h record
  const team1Bonus = Math.round(team1WinRate * 10);
  const team2Bonus = Math.round(team2WinRate * 10);
  
  return { team1Bonus, team2Bonus };
};

// Calculate advantage based on recent form
const calculateRecentFormAdvantage = (stats: MatchStats, team1: string, team2: string) => {
  const team1Form = stats.recentForm[team1] || { matchesWon: 0, totalMatches: 0 };
  const team2Form = stats.recentForm[team2] || { matchesWon: 0, totalMatches: 0 };
  
  const team1WinRate = team1Form.totalMatches > 0 ? team1Form.matchesWon / team1Form.totalMatches : 0;
  const team2WinRate = team2Form.totalMatches > 0 ? team2Form.matchesWon / team2Form.totalMatches : 0;
  
  // Scale: up to 15 points advantage for excellent recent form
  const team1Bonus = Math.round(team1WinRate * 15);
  const team2Bonus = Math.round(team2WinRate * 15);
  
  return { team1Bonus, team2Bonus };
};

// Calculate influence of key players
const calculateKeyPlayerInfluence = (stats: MatchStats, team1: string, team2: string) => {
  const team1Players = stats.keyPlayers[team1] || [];
  const team2Players = stats.keyPlayers[team2] || [];
  
  // Calculate average form rating of key players
  const team1AvgForm = team1Players.length > 0 
    ? team1Players.reduce((sum, player) => sum + player.recentForm, 0) / team1Players.length 
    : 0;
  
  const team2AvgForm = team2Players.length > 0 
    ? team2Players.reduce((sum, player) => sum + player.recentForm, 0) / team2Players.length 
    : 0;
  
  // Scale: up to 8 points advantage for teams with in-form key players
  const team1Bonus = Math.round(team1AvgForm * 0.8);
  const team2Bonus = Math.round(team2AvgForm * 0.8);
  
  return { team1Bonus, team2Bonus };
};

// Generate factors to explain real-time data influence
const generateRealTimeFactors = (stats: MatchStats, team1: string, team2: string) => {
  const factors = [];
  
  // Head-to-head factor
  const h2h = stats.h2h;
  if (h2h.total > 0) {
    const team1Wins = stats.teamHomeName === team1 ? h2h.teamHomeWins : h2h.teamAwayWins;
    const team2Wins = stats.teamHomeName === team2 ? h2h.teamHomeWins : h2h.teamAwayWins;
    
    if (team1Wins > team2Wins) {
      factors.push({
        factor: "Head-to-Head Record",
        description: `${team1} has won ${team1Wins} out of ${h2h.total} matches against ${team2}`,
        impact: 7
      });
    } else if (team2Wins > team1Wins) {
      factors.push({
        factor: "Head-to-Head Record",
        description: `${team2} has won ${team2Wins} out of ${h2h.total} matches against ${team1}`,
        impact: 7
      });
    }
  }
  
  // Recent form factor
  const team1Form = stats.recentForm[team1];
  const team2Form = stats.recentForm[team2];
  
  if (team1Form && team2Form) {
    const team1WinRate = team1Form.matchesWon / team1Form.totalMatches;
    const team2WinRate = team2Form.matchesWon / team2Form.totalMatches;
    
    if (team1WinRate > team2WinRate + 0.2) { // 20% better win rate
      factors.push({
        factor: "Recent Form",
        description: `${team1} has won ${team1Form.matchesWon} of their last ${team1Form.totalMatches} matches (${Math.round(team1WinRate * 100)}%)`,
        impact: 8
      });
    } else if (team2WinRate > team1WinRate + 0.2) {
      factors.push({
        factor: "Recent Form",
        description: `${team2} has won ${team2Form.matchesWon} of their last ${team2Form.totalMatches} matches (${Math.round(team2WinRate * 100)}%)`,
        impact: 8
      });
    }
  }
  
  // Key player factor
  const team1Players = stats.keyPlayers[team1] || [];
  const team2Players = stats.keyPlayers[team2] || [];
  
  if (team1Players.length > 0) {
    const bestPlayer = team1Players.reduce((best, current) => 
      current.recentForm > best.recentForm ? current : best, team1Players[0]);
    
    if (bestPlayer.recentForm >= 8) {
      factors.push({
        factor: "Key Player Form",
        description: `${bestPlayer.name} from ${team1} is in exceptional form (${bestPlayer.recentForm}/10)`,
        impact: 6
      });
    }
  }
  
  if (team2Players.length > 0) {
    const bestPlayer = team2Players.reduce((best, current) => 
      current.recentForm > best.recentForm ? current : best, team2Players[0]);
    
    if (bestPlayer.recentForm >= 8) {
      factors.push({
        factor: "Key Player Form",
        description: `${bestPlayer.name} from ${team2} is in exceptional form (${bestPlayer.recentForm}/10)`,
        impact: 6
      });
    }
  }
  
  return factors;
};

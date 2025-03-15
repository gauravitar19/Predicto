
import { PredictionFactor, PredictionInput } from '../types/predictionTypes';
import { calculateVenueAdvantage } from './venueUtils';
import { getTeamCountry } from './teamUtils';

// Generate key factors for the prediction
export const generateFactors = (
  team1: string, 
  team2: string, 
  input: PredictionInput, 
  winner: string
): PredictionFactor[] => {
  const { team1Stats, team2Stats, venue, weather, matchFormat, venueDetails } = input;
  const factors: PredictionFactor[] = [];
  const winnerStats = winner === team1 ? team1Stats : team2Stats;
  const loserStats = winner === team1 ? team2Stats : team1Stats;
  
  // Recent form factor
  if (winnerStats.recentWins > loserStats.recentWins) {
    factors.push({
      factor: `${winner} has better recent form (${winnerStats.recentWins} vs ${loserStats.recentWins} wins)`,
      weight: 25
    });
  }
  
  // Batting strength
  if (winnerStats.battingAvg > loserStats.battingAvg) {
    factors.push({
      factor: `${winner} has stronger batting lineup`,
      weight: 20
    });
  }
  
  // Bowling strength
  if (winnerStats.bowlingAvg < loserStats.bowlingAvg) {
    factors.push({
      factor: `${winner} has more effective bowling attack`,
      weight: 18
    });
  }
  
  // Venue advantage
  const venueAdvantage = calculateVenueAdvantage(team1, team2, venue);
  if (venueAdvantage === winner) {
    factors.push({
      factor: `${venue} historically favors ${winner}`,
      weight: 15
    });
  }
  
  // Venue country advantage
  if (venueDetails && getTeamCountry(winner) === venueDetails.country) {
    factors.push({
      factor: `Home advantage at ${venueDetails.ground_long}`,
      weight: 17
    });
  }
  
  // Ground size factor
  if (venueDetails) {
    const groundSize = venueDetails.width * venueDetails.height;
    if ((groundSize > 22000 && (winner === 'Australia' || winner === 'South Africa')) ||
        (groundSize < 18000 && (winner === 'West Indies' || winner === 'India'))) {
      factors.push({
        factor: `${venueDetails.ground_long}'s dimensions (${venueDetails.width}m × ${venueDetails.height}m) favor ${winner}'s playing style`,
        weight: 13
      });
    }
  }
  
  // Weather conditions
  if (weather.condition === 'Rainy' || weather.condition === 'Overcast') {
    if (winnerStats.bowlingAvg < 28) {
      factors.push({
        factor: `${weather.condition} conditions favor ${winner}'s bowling attack`,
        weight: 12
      });
    }
  } else if (weather.condition === 'Sunny' && winnerStats.battingAvg > 32) {
    factors.push({
      factor: `${weather.condition} conditions favor ${winner}'s batting lineup`,
      weight: 10
    });
  }
  
  // Match format specific
  if (matchFormat === 'test' && winnerStats.bowlingAvg < 30) {
    factors.push({
      factor: `${winner}'s bowling strength is well-suited for Test matches`,
      weight: 14
    });
  } else if (matchFormat === 't20' && winnerStats.battingAvg > 30) {
    factors.push({
      factor: `${winner}'s batting aggression is ideal for T20 format`,
      weight: 16
    });
  }
  
  // If we don't have enough factors, add a generic one
  if (factors.length < 3) {
    factors.push({
      factor: `Historical matchup statistics favor ${winner}`,
      weight: 10
    });
  }
  
  // Sort by weight (highest first)
  return factors.sort((a, b) => b.weight - a.weight).slice(0, 5);
};

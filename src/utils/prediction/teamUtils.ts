import { TeamStats, Weather } from '../types/predictionTypes';

// Calculate team strength based on stats and weather
export const calculateTeamStrength = (stats: TeamStats, weather: Weather): number => {
  // Base strength from batting and bowling averages
  let strength = (stats.battingAvg * 1.5) - (stats.bowlingAvg * 0.8);
  
  // Add recent form impact (5 points per recent win)
  strength += stats.recentWins * 5;
  
  // Weather impact
  if (weather.condition === 'Rainy' || weather.condition === 'Overcast') {
    // If bowling average is good (lower is better), team does better in overcast conditions
    if (stats.bowlingAvg < 25) strength += 5;
  } else if (weather.condition === 'Sunny') {
    // Batting teams do better in sunny conditions
    if (stats.battingAvg > 30) strength += 5;
  }
  
  // Cap the strength to keep it within reasonable bounds
  return Math.max(30, Math.min(strength, 100));
};

// Get country code from team name
export const getTeamCountry = (team: string): string => {
  const teamCountryMap: {[key: string]: string} = {
    'India': 'Ind',
    'Australia': 'Aus',
    'England': 'UK',
    'South Africa': 'SA',
    'New Zealand': 'NZ',
    'Pakistan': 'Pak',
    'Sri Lanka': 'SL',
    'West Indies': 'WI',
    'Bangladesh': 'Ban',
    'Afghanistan': 'Afg',
    'Zimbabwe': 'Zim'
  };
  
  return teamCountryMap[team] || '';
};

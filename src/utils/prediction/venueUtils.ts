
import { CricketGround } from '../supabaseClient';
import { getTeamCountry } from './teamUtils';

// Calculate venue advantage for teams
export const calculateVenueAdvantage = (team1: string, team2: string, venue: string): string => {
  // This is a simplified model - in a real app, you would have actual venue advantage data
  
  // Some dummy venue advantages
  const venueAdvantages: Record<string, string> = {
    "Melbourne Cricket Ground": "Australia",
    "Eden Gardens, Kolkata": "India",
    "Lord's, London": "England",
    "Wankhede Stadium, Mumbai": "India",
    "Wanderers Stadium, Johannesburg": "South Africa"
  };
  
  if (venueAdvantages[venue] === team1) return team1;
  if (venueAdvantages[venue] === team2) return team2;
  
  return "";
};

// Calculate venue-specific factors 
export const calculateVenueFactors = (
  venue: CricketGround, 
  team1: string, 
  team2: string, 
  matchFormat: string
): { team1Bonus: number; team2Bonus: number } => {
  let team1Bonus = 0;
  let team2Bonus = 0;
  
  // Check if venue is in same country as any team
  if (getTeamCountry(team1) === venue.country) {
    team1Bonus += 3; // Home ground advantage
  }
  
  if (getTeamCountry(team2) === venue.country) {
    team2Bonus += 3; // Home ground advantage
  }
  
  // ODI-only grounds might favor teams with better ODI record
  if (venue.odi_only && matchFormat === 'odi') {
    // This would be expanded with real data about team's ODI performance
    if (team1 === 'New Zealand' || team1 === 'England') team1Bonus += 2;
    if (team2 === 'New Zealand' || team2 === 'England') team2Bonus += 2;
  }
  
  // Ground size affects teams differently
  const groundSize = venue.width * venue.height;
  
  // Larger grounds favor teams with strong bowling
  if (groundSize > 22000) { // Arbitrary threshold for "large" grounds
    if (team1 === 'Australia' || team1 === 'South Africa') team1Bonus += 2;
    if (team2 === 'Australia' || team2 === 'South Africa') team2Bonus += 2;
  } 
  // Smaller grounds favor teams with aggressive batting
  else if (groundSize < 18000) { // Arbitrary threshold for "small" grounds
    if (team1 === 'West Indies' || team1 === 'India') team1Bonus += 2;
    if (team2 === 'West Indies' || team2 === 'India') team2Bonus += 2;
  }
  
  return { team1Bonus, team2Bonus };
};

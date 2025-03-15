
import { useState, useEffect } from 'react';
import { fetchCricketGroundByName, CricketGround } from '@/utils/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface PredictionFormData {
  team1: string;
  team2: string;
  venue: string;
  matchFormat: string;
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
  };
  team1Stats: {
    recentWins: number;
    battingAvg: number;
    bowlingAvg: number;
  };
  team2Stats: {
    recentWins: number;
    battingAvg: number;
    bowlingAvg: number;
  };
  venueDetails: CricketGround | null;
}

export const usePredictionForm = (onPredictionResult: (result: any) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Match Details
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [venue, setVenue] = useState('');
  const [matchFormat, setMatchFormat] = useState('odi');
  
  // Selected venue details
  const [selectedVenue, setSelectedVenue] = useState<CricketGround | null>(null);
  
  // Weather
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  
  // Team 1 Stats
  const [team1RecentWins, setTeam1RecentWins] = useState('3');
  const [team1BattingAvg, setTeam1BattingAvg] = useState('32');
  const [team1BowlingAvg, setTeam1BowlingAvg] = useState('28');
  
  // Team 2 Stats
  const [team2RecentWins, setTeam2RecentWins] = useState('2');
  const [team2BattingAvg, setTeam2BattingAvg] = useState('30');
  const [team2BowlingAvg, setTeam2BowlingAvg] = useState('30');

  // Fetch venue details when venue name changes
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (venue) {
        const details = await fetchCricketGroundByName(venue);
        setSelectedVenue(details);
      } else {
        setSelectedVenue(null);
      }
    };
    
    fetchVenueDetails();
  }, [venue]);

  const validateForm = (): boolean => {
    if (!team1 || !team2 || !venue || team1 === team2) {
      toast({
        title: "Invalid form data",
        description: team1 === team2 
          ? "Teams must be different" 
          : "Please fill all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const getFormData = (): PredictionFormData => {
    return {
      team1,
      team2,
      venue,
      matchFormat,
      weather: {
        temperature,
        humidity,
        condition: weatherCondition
      },
      team1Stats: {
        recentWins: parseInt(team1RecentWins),
        battingAvg: parseFloat(team1BattingAvg),
        bowlingAvg: parseFloat(team1BowlingAvg)
      },
      team2Stats: {
        recentWins: parseInt(team2RecentWins),
        battingAvg: parseFloat(team2BattingAvg),
        bowlingAvg: parseFloat(team2BowlingAvg)
      },
      venueDetails: selectedVenue
    };
  };

  return {
    // Form state
    team1,
    setTeam1,
    team2,
    setTeam2,
    venue,
    setVenue,
    matchFormat,
    setMatchFormat,
    selectedVenue,
    temperature,
    setTemperature,
    humidity,
    setHumidity,
    weatherCondition,
    setWeatherCondition,
    team1RecentWins,
    setTeam1RecentWins,
    team1BattingAvg,
    setTeam1BattingAvg,
    team1BowlingAvg,
    setTeam1BowlingAvg,
    team2RecentWins,
    setTeam2RecentWins,
    team2BattingAvg,
    setTeam2BattingAvg,
    team2BowlingAvg,
    setTeam2BowlingAvg,
    isLoading,
    setIsLoading,
    // Helper functions
    validateForm,
    getFormData
  };
};

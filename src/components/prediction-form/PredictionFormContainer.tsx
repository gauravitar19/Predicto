import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import VenueDetails from '../VenueDetails';
import TeamStatsInput from '../TeamStatsInput';
import WeatherInput from '../WeatherInput';
import AiSettingsSection from './AiSettingsSection';
import { fetchCricketGrounds } from '@/utils/supabaseClient';
import { predictMatchOutcome } from '@/utils/predictionModel';
import { usePredictionForm } from '@/hooks/usePredictionForm';
import { useQuery } from '@tanstack/react-query';
import { initializeAiModels } from '@/utils/aiAnalysis';
import TeamSelectionSection from './TeamSelectionSection';
import VenueFormatSection from './VenueFormatSection';
import FormSubmitButton from './FormSubmitButton';
import { fetchWeatherForLocation, useWeatherData, WeatherData } from '@/utils/weatherApi';
import { Badge } from '@/components/ui/badge';
import { getMatchDetails } from '@/utils/cricketDataApi';

interface PredictionFormContainerProps {
  onPredictionResult: (result: any) => void;
  matchId?: string | null;
}

const PredictionFormContainer: React.FC<PredictionFormContainerProps> = ({ 
  onPredictionResult,
  matchId 
}) => {
  const { toast } = useToast();
  const [useAI, setUseAI] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [useAutoWeather, setUseAutoWeather] = useState(true);
  const [useRealTimeData, setUseRealTimeData] = useState(!!matchId);
  
  const { fetchWeatherData } = useWeatherData();
  
  // Fetch match details if matchId is provided
  const { 
    data: matchDetails,
    isLoading: isLoadingMatch
  } = useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: () => matchId ? getMatchDetails(matchId) : null,
    enabled: !!matchId,
  });
  
  const {
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
    validateForm,
    getFormData
  } = usePredictionForm(onPredictionResult);
  
  // Auto-fill form values when match details are available
  useEffect(() => {
    if (matchDetails && useRealTimeData) {
      // Set teams
      if (matchDetails.teamInfo && matchDetails.teamInfo.length >= 2) {
        setTeam1(matchDetails.teamInfo[0].name);
        setTeam2(matchDetails.teamInfo[1].name);
      }
      
      // Set venue
      if (matchDetails.venue) {
        setVenue(matchDetails.venue);
      }
      
      // Set match format
      if (matchDetails.matchType) {
        const format = matchDetails.matchType.toLowerCase();
        if (format.includes('test')) {
          setMatchFormat('test');
        } else if (format.includes('t20') || format.includes('twenty20')) {
          setMatchFormat('t20');
        } else if (format.includes('odi') || format.includes('one day')) {
          setMatchFormat('odi');
        }
      }
      
      // Show toast notification
      toast({
        title: "Match Data Loaded",
        description: `Using real-time data for: ${matchDetails.name}`,
      });
    }
  }, [matchDetails, useRealTimeData]);
  
  // Fetch weather when venue changes
  const handleVenueSelect = async (venue: string, country: string) => {
    if (useAutoWeather && venue) {
      setIsLoadingWeather(true);
      try {
        const data = await fetchWeatherData(venue, country);
        setWeatherData(data);
        toast({
          title: "Weather Updated",
          description: `Live weather data for ${data.location || venue}`,
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    }
  };
  
  // Refresh weather data
  const refreshWeatherData = async () => {
    if (selectedVenue) {
      handleVenueSelect(selectedVenue.ground, selectedVenue.country);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (useAI) {
        await initializeAiModels();
      }
      
      const predictionData = {
        ...getFormData(),
        useAI,
        matchId: useRealTimeData ? matchId : undefined
      };
      
      const result = await predictMatchOutcome(predictionData);
      
      onPredictionResult(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prediction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {matchId && (
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-cricket-50 dark:bg-cricket-900 text-cricket-700 dark:text-cricket-300 border-cricket-200 dark:border-cricket-800">
            Using real-time match data
          </Badge>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useRealTimeData}
              onChange={(e) => setUseRealTimeData(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-cricket-600 focus:ring-cricket-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Use real-time data
            </span>
          </label>
        </div>
      )}
      
      <Card className="form-container border-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TeamSelectionSection 
              team1={team1}
              setTeam1={setTeam1}
              team2={team2}
              setTeam2={setTeam2}
              isDisabled={isLoadingMatch || (useRealTimeData && !!matchDetails)}
            />
            
            <VenueFormatSection 
              venue={venue}
              setVenue={setVenue}
              matchFormat={matchFormat}
              setMatchFormat={setMatchFormat}
              onVenueSelect={handleVenueSelect}
              isDisabled={isLoadingMatch || (useRealTimeData && !!matchDetails)}
            />
            
            {selectedVenue && <VenueDetails venue={selectedVenue} />}
            
            <WeatherInput
              temperature={temperature}
              setTemperature={setTemperature}
              humidity={humidity}
              setHumidity={setHumidity}
              weatherCondition={weatherCondition}
              setWeatherCondition={setWeatherCondition}
              isAutoWeather={useAutoWeather}
              weatherData={weatherData}
              isLoadingWeather={isLoadingWeather}
              onRefreshWeather={refreshWeatherData}
            />
            
            <TeamStatsInput
              team1={team1}
              team2={team2}
              team1RecentWins={team1RecentWins}
              setTeam1RecentWins={setTeam1RecentWins}
              team1BattingAvg={team1BattingAvg}
              setTeam1BattingAvg={setTeam1BattingAvg}
              team1BowlingAvg={team1BowlingAvg}
              setTeam1BowlingAvg={setTeam1BowlingAvg}
              team2RecentWins={team2RecentWins}
              setTeam2RecentWins={setTeam2RecentWins}
              team2BattingAvg={team2BattingAvg}
              setTeam2BattingAvg={setTeam2BattingAvg}
              team2BowlingAvg={team2BowlingAvg}
              setTeam2BowlingAvg={setTeam2BowlingAvg}
            />
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAutoWeather}
                  onChange={(e) => setUseAutoWeather(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Use live weather data</span>
              </label>
            </div>
            
            <AiSettingsSection useAI={useAI} setUseAI={setUseAI} />
            
            <FormSubmitButton isLoading={isLoading} />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PredictionFormContainer;
